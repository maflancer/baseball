#!/usr/bin/env python3
"""
Fantasy Baseball Weekly Stats Extractor
Extracts weekly matchup statistics from Yahoo Fantasy Baseball API.
"""

import csv
import json
import logging
import os
from datetime import datetime
from pathlib import Path
from typing import Dict, List, Any, Optional

from yahoo_oauth import OAuth2
import yahoo_fantasy_api as yfa

# Set up logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

# Constants
CURRENT_YEAR = datetime.now().year
OUTPUT_FILE = f"public/data/stats_{CURRENT_YEAR}.csv"

# Yahoo Fantasy stat ID mapping
STAT_IDS = {
    "60": "H/AB",
    "7": "R", 
    "12": "HR",
    "13": "RBI",
    "16": "SB",
    "23": "TB",
    "3": "AVG",
    "4": "OBP",
    "50": "IP",
    "42": "K",
    "26": "ERA",
    "27": "WHIP",
    "89": "SV",
}

def load_team_mapping() -> Dict[str, str]:
    """Load team name sanitization mapping from environment variable."""
    mapping_json = os.getenv('TEAM_NAME_MAPPING', '{}')
    try:
        return json.loads(mapping_json)
    except json.JSONDecodeError:
        logger.warning("Invalid team name mapping JSON, using empty mapping")
        return {}

def sanitize_team_name(name: str, mapping: Dict[str, str]) -> str:
    """Sanitize team name using mapping dictionary."""
    return mapping.get(name, name)

def get_team_key(week, matchup_id, team):
    """Extract team key from week data."""
    return week["fantasy_content"]["league"][1]["scoreboard"]["0"]["matchups"][
        str(matchup_id)
    ]["matchup"]["0"]["teams"][str(team)]["team"][0][0]["team_key"]

def get_team_id(week, matchup_id, team):
    """Extract team ID from week data."""
    return week["fantasy_content"]["league"][1]["scoreboard"]["0"]["matchups"][
        str(matchup_id)
    ]["matchup"]["0"]["teams"][str(team)]["team"][0][1]["team_id"]

def get_team_name(week, matchup_id, team):
    """Extract team name from week data."""
    return week["fantasy_content"]["league"][1]["scoreboard"]["0"]["matchups"][
        str(matchup_id)
    ]["matchup"]["0"]["teams"][str(team)]["team"][0][2]["name"]

def get_team_stats(week, matchup_id, team):
    """Extract team stats from week data."""
    stat_list = week["fantasy_content"]["league"][1]["scoreboard"]["0"][
        "matchups"
    ][str(matchup_id)]["matchup"]["0"]["teams"][str(team)]["team"][1][
        "team_stats"
    ]["stats"]

    stats = {}
    for stat in stat_list:
        if stat["stat"]["stat_id"] in STAT_IDS:
            stats[STAT_IDS[stat["stat"]["stat_id"]]] = stat["stat"]["value"]
    return stats

def get_winner_key(week, matchup_id):
    """Get winner team key, return None if tie."""
    try:
        return week["fantasy_content"]["league"][1]["scoreboard"]["0"][
            "matchups"
        ][str(matchup_id)]["matchup"]["winner_team_key"]
    except KeyError:
        return None

def get_matchup_stats(league, team_mapping):
    """Extract all matchup statistics for the season."""
    logger.info("Starting matchup stats extraction...")
    stats = []
    
    current_week = league.current_week()
    logger.info(f"Processing weeks 1 through {current_week - 1}")
    
    for week in range(1, current_week):
        logger.info(f"Processing week {week}")
        
        try:
            week_info = league.matchups(week)
            
            # Determine number of matchups (handles playoffs)
            if week == 22:
                num_matchups = 4
            elif week == 23:
                num_matchups = 2
            elif week == 24:
                num_matchups = 1
            else:
                num_matchups = 7
                
            for matchup_id in range(0, num_matchups):
                winner_key = get_winner_key(week_info, matchup_id)
                
                for team in range(0, 2):
                    team_key = get_team_key(week_info, matchup_id, team)
                    team_id = get_team_id(week_info, matchup_id, team)
                    raw_team_name = get_team_name(week_info, matchup_id, team)
                    team_name = sanitize_team_name(raw_team_name, team_mapping)
                    team_stats = get_team_stats(week_info, matchup_id, team)
                    
                    if winner_key is None:
                        result = "-1"  # Tie
                    else:
                        result = "1" if str(team_key) == str(winner_key) else "0"

                    team_info = {
                        "week": week,
                        "matchup_id": matchup_id,
                        "team_key": team_key,
                        "team_id": team_id,
                        "team_name": team_name,
                        "result": result,
                    }
                    team_info.update(team_stats)
                    stats.append(team_info)
                    
        except Exception as e:
            logger.error(f"Failed to process week {week}: {e}")
            continue
            
    logger.info(f"Extracted {len(stats)} stat records")
    return stats

def main():
    """Main execution function."""
    try:
        # Load team name mapping
        team_mapping = load_team_mapping()
        logger.info(f"Loaded {len(team_mapping)} team name mappings")
        
        # Set up OAuth and API
        oauth = OAuth2(None, None, from_file="oauth2.json")
        game = yfa.Game(oauth, "mlb")
        league_id = game.league_ids(year=CURRENT_YEAR)
        league = game.to_league(league_id[0])
        
        # Extract stats
        stats = get_matchup_stats(league, team_mapping)
        
        # Export to CSV
        if stats:
            # Ensure output directory exists
            Path("public/data").mkdir(parents=True, exist_ok=True)
            
            with open(OUTPUT_FILE, "w", newline="", encoding="utf-8") as f:
                dict_writer = csv.DictWriter(f, stats[0].keys())
                dict_writer.writeheader()
                dict_writer.writerows(stats)
            
            logger.info(f"Exported {len(stats)} records to {OUTPUT_FILE}")
        else:
            logger.warning("No stats to export")
            
    except Exception as e:
        logger.error(f"Script failed: {e}")
        raise

if __name__ == "__main__":
    main()
