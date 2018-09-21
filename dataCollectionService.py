import sys

from flask import Flask,render_template, request
from flask_cors import CORS
from config import DevConfig
from bs4 import BeautifulSoup
from flask_jsonpify import jsonpify
import datetime
from datetime import date

import time
import numpy as np
import pandas as pd
import requests as rq

#取得div的Id
def getId(s):
    format = '0123456789'
    for c in s:
        if c not in format:
            s = s.replace(c,'')
    return s    
#將多餘的字元去掉
def replace_all(text, dic):
    for i, j in dic.items():
        text = text.replace(i, j)
    return text    


def getContent():
    url = 'https://classic.sportsbookreview.com/ajax/?a=[SBR.Odds.Modules]OddsEvent_GetConsensus'
    payload = {
        'UserId': '0',
        'Sport': 'baseball',
        'League': 'MLB',
        'EventId': '3387670',
        'View': 'CO',
        'SportsbookId': '0',
        'DefaultBookId': '0',
        'ConsensusBookId': '19',
        'PeriodTypeId': '',
        'StartDate': '2018-09-20',
        'MatchupLink': 'https://classic.sportsbookreview.com/betting-odds/mlb-baseball/ny-mets-vs-washington-nationals-3387670/',
        'Key': 'ec7fbd5935fc25d86592d3e48eea2d68',
        'theme': 'Blue',
    }
    headers = {
        'Host': 'classic.sportsbookreview.com',
        'Origin': 'https://classic.sportsbookreview.com',
        'Referer': 'https://classic.sportsbookreview.com/betting-odds/mlb-baseball/totals/?date=20180920'
    }
    r = rq.post(url, data=payload, headers=headers)
    r.headers['Access-Control-Allow-Origin'] = '*'
    r.headers['Access-Control-Allow-Methods'] = 'OPTIONS,HEAD,GET,POST'
    r.headers['Access-Control-Allow-Headers'] = 'x-requested-with'
    soup = BeautifulSoup(r.text, 'lxml')
    
    awayTeamData = []
    homeTeamData = []
    for teamName in soup.find_all("td", class_="header-grid"):
        awayTeamData.append(teamName.text)
    return awayTeamData

def getData():
    url = 'http://classic.sportsbookreview.com/betting-odds/mlb-baseball/totals/?date=' + str(date.today()).replace('-','')
    response = rq.get(url) # 用 requests 的 get 方法把網頁抓下來
    soup = BeautifulSoup(response.text, "lxml") # 指定 lxml 作為解析器

    
    idList = []
    #for div in soup.find_all("div", class_= "eventBox"):
    #    idList.append(div['id'])

    #teamList = [] #['隊伍-投手','隊伍-投手','隊伍-投手',......]
    #replaceStr = {"\xa0": "", "\n": "", " ": ""}
    #for id in idList: getId(str(div))
        #target = soup.find_all("div", id=id)
        #for t in target:
            #teams = t.find_all("span", class_="team-name")
            #matchUp = ""
            #for team in teams:
                #teamList.append(replace_all(team.text, replaceStr))

    #awayTeamData = []
    #homeTeamData = []
    return idList
    
  