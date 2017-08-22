#!/usr/bin/python
# coding:utf-8


import sqlite3
import sys, getopt
from sqlalchemy import create_engine
import tushare as ts


# def createsh_margins():
engine = create_engine('sqlite:////Users/liguoliang/UD78/src/db.sqlite3', echo=False)
df = ts.sh_margins(start='2015-01-01', end='2015-01-15')
# 存入数据库
#df.to_sql('sh_margins',engine)
# 追加数据到现有表
df.to_sql('sh_margins', engine, if_exists='append')



