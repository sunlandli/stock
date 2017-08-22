#!/usr/bin/python
# coding:utf-8

from sqlalchemy import create_engine
from datetime import datetime

import pandas as pd
import tushare as ts
import sys,sqlite3
import datetime

#def cleantrend_database():
# engine = create_engine('sqlite:////Users/liguoliang/UD78/src/db.sqlite3', echo=True)
# conn = sqlite3.connect('/Users/liguoliang/UD78/src/db.sqlite3')
# conn.text_factory = lambda x: unicode(x, 'utf-8', 'ignore')
# c = conn.cursor()
#
# query2 = "select * from sh_margins order by opDate"
# df = pd.read_sql(query2, conn)
# cur = conn.cursor()
# query4 = "delete from sh_margins where rowid not in(select max(rowid) from sh_margins group by opDate)"   # 注1
# cur.execute(query4)
# conn.commit()
#
# query2 = "select * from sz_margins order by opDate"
# df = pd.read_sql(query2, conn)
# cur = conn.cursor()
# query4 = "delete from sz_margins where rowid not in(select max(rowid) from sz_margins group by opDate)"   # 注1
# cur.execute(query4)
# conn.commit()



#def updatetrend_database():
# engine = create_engine('sqlite:////Users/liguoliang/UD78/src/db.sqlite3', echo=True)
# conn = sqlite3.connect('/Users/liguoliang/UD78/src/db.sqlite3')
# conn.text_factory = lambda x: unicode(x, 'utf-8', 'ignore')
# c = conn.cursor()
#
# today = str(pd.Timestamp(datetime.datetime.now()))[:10]
# queryday = "select * from sh_margins order by opDate"
# df = pd.read_sql(queryday, conn)
# df = df.set_index('opDate')
#
# queryday1 = "select * from sz_margins order by opDate"
# df1 = pd.read_sql(queryday1, conn)
# df1 = df1.set_index('opDate')
#
# if datetime.datetime.now().weekday() == 5:  # 注1
#     today = str(pd.Timestamp(datetime.datetime.now()) - pd.Timedelta(days=1))[:10]  # 注2
# elif datetime.datetime.now().weekday() == 6:
#     today = str(pd.Timestamp(datetime.datetime.now()) - pd.Timedelta(days=2))[:10]
# else:
#     today = str(pd.Timestamp(datetime.datetime.now()))[:10]
# if today != df.ix[-1].name[:10]:
#     try:
#         df = ts.sh_margins(start=df.ix[-1].name[:10], end=today)
#         df.to_sql('sh_margins',engine,if_exists='append')
#         print 'SH successed'
#     except:
#         print 'error'
# if today != df1.ix[-1].name[:10]:
#     try:
#         df1 = ts.sz_margins(start=df1.ix[-1].name[:10], end=today)
#         df1.to_sql('sz_margins', engine, if_exists='append')
#         print 'SZ successed'
#     except:
#         print 'error'


#def creattrend_database():
    # engine = create_engine('sqlite:////Users/liguoliang/UD78/src/db.sqlite3', echo=True)
    # start = (datetime.datetime.today() - datetime.timedelta(180)).strftime("%Y-%m-%d")
    # end = datetime.datetime.today().strftime("%Y-%m-%d")
    # df=ts.sh_margins(start=start, end=end)
    # #存入数据库
    # df.to_sql('sh_margins',engine)
    # #追加数据到现有表
    # #df.to_sql('sh_margins',engine,if_exists='append')
    # df=ts.sz_margins(start=start, end=end)
    # df.to_sql('sz_margins',engine)

