#encoding:utf-8
import sys

from flask import Flask,render_template, request,make_response
from flask_cors import CORS
from config import DevConfig
from bs4 import BeautifulSoup
from flask_jsonpify import jsonpify
from functools import wraps
import numpy as np
import pandas as pd
import requests as rq
import dataCollectionService as dcs

app = Flask(__name__)
app.config.from_object(DevConfig)
CORS(app, resources=r'/*')

@app.route('/getData')
def getData():
    result = dcs.getContent()

    return render_template('DataFrame.html', data=result)

if __name__ == '__main__':
    app.run()