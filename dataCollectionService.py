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
import organizeDataService as ocs

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

#整理讓分data
def getPointsSpreadsDatas(psd):
    awayTeam = []
    homeTeam = []
    for d in psd.find_all("td"):
        awayTeam.append(d.text)
    return awayTeam

#設定request 並取得response
def initRequestAndGetResponse(id):
    time = str(date.today()).replace('-','')
    url = 'https://classic.sportsbookreview.com/ajax/?a=[SBR.Odds.Modules]OddsEvent_GetConsensus'
    payload = {
        'UserId': '0',
        'Sport': 'basketball',
        'League': 'NBA',
        'EventId': id,
        'View': 'CO',
        'SportsbookId': '0',
        'DefaultBookId': '0',
        'ConsensusBookId': '19',
        'PeriodTypeId': '',
        'StartDate': '2017-11-16',
        'MatchupLink': 'https://classic.sportsbookreview.com/betting-odds/nba-basketball/golden-state-warriors-vs-boston-celtics-' + id + '/',
        'Key': 'ec7fbd5935fc25d86592d3e48eea2d68',
        'theme': 'Blue',
    }
    headers = {
        'Host': 'classic.sportsbookreview.com',
        'Origin': 'https://classic.sportsbookreview.com',
        'Referer': 'https://classic.sportsbookreview.com/betting-odds/nba-basketball/?date=20171116'
    }
    r = rq.post(url, data=payload, headers=headers)
    r.headers['Access-Control-Allow-Origin'] = '*'
    r.headers['Access-Control-Allow-Methods'] = 'OPTIONS,HEAD,GET,POST'
    r.headers['Access-Control-Allow-Headers'] = 'x-requested-with'

    return r

def getIdList():
    url = 'https://classic.sportsbookreview.com/betting-odds/nba-basketball/?date=20171116'
    #url = 'http://classic.sportsbookreview.com/betting-odds/nba-baseball/totals/?date=' + str(date.today()).replace('-','')
    response = rq.get(url) # 用 requests 的 get 方法把網頁抓下來
    soup = BeautifulSoup(response.text, "lxml") # 指定 lxml 作為解析器
    
    resultList = []
    for div in soup.find_all("div", class_= "event-holder"):
        teamList = []
        for teamValue in div.find_all("span", class_="team-name"):
            teamList.append(teamValue.text)
        resultList.append(dict(id=getId(div['id']), homeTeam=teamList[0], awayTeam=teamList[1]))
    #將對戰基本資訊存入DB
    return resultList

def getContent():
    datas = []
    awayTeamData = [] #客隊資訊
    homeTeamData = [] #主隊資訊
    pointsSpreadsData = [] #讓分
    moneyLinesData = [] #PK
    totalData = [] #總分    

    idList = getIdList()
    for obj in idList: 
        response = initRequestAndGetResponse(obj["id"])
        soup = BeautifulSoup(response.text, 'lxml')
        #取得所有Data
        for data in soup.find_all("div", class_="info-box"):
            datas.append(data)
    pointsSpreadsData.append(getPointsSpreadsDatas(datas[0])) 

    return pointsSpreadsData
    
  
