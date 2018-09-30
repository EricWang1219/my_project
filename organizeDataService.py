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