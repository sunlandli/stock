#!/usr/bin/python
# coding:utf-8

from sqlalchemy import create_engine
from datetime import datetime

import pandas as pd
import tushare as ts
import sys,sqlite3
import datetime


engine = create_engine('sqlite:////Users/liguoliang/UD78/src/db.sqlite3', echo=True)
conn = sqlite3.connect('/Users/liguoliang/UD78/src/db.sqlite3')
conn.text_factory = lambda x: unicode(x, 'utf-8', 'ignore')
c = conn.cursor()

query = "select * from sz_margins GROUP by OPdate"
query1 = "select * from sh_margins GROUP by OPdate"
df = pd.read_sql(query1, conn)
szma = pd.read_sql(query, conn)

s=list(df[u'rzye'])   #资数值
s1=list(df[u'rqyl'])   #券
d=list(df[u'opDate'])   #日期
count =len(d)

szs = list(szma[u'rzye'])
szs2 = list(szma[u'rqyl'])
szd = list(szma[u'opDate'])


ma=15
while count-ma > 0:
    c = s[count-1] - s[count-ma]
    cq = s1[count-1] - s1[count-ma]
    c1 = szs[count-1] - szs[count-ma]
    cq1 = szs2[count-1] - szs2[count-ma]
    print ma,'日差量','上海：',d[count-1],'日资',s[count-1],s[count-ma],c/100000000,'深圳：',szd[count-1],'日资',szs[count-1],szs[count-ma],c1/100000000
    print ma,'日差量','上海：',d[count-1],'日券',s1[count-1],s1[count-ma],cq,'深圳：',szd[count-1],'日券',szs2[count-1],szs2[count-ma],c1
    print
    count -=1
#
# c=s[0]-s[-1]      #头尾差额
# c1=s1[0]-s1[-1]      #头尾差额
# percent=(float(c)/float(s[-1]))*100    #计算百分比
# percent1=(float(c1)/float(s1[-1]))*100    #计算百分比




########################清洗历史趋势数据库################################
#def cleantrend_database():
# engine = create_engine('sqlite:////Users/liguoliang/UD78/src/db.sqlite3', echo=True)
# conn = sqlite3.connect('/Users/liguoliang/UD78/src/db.sqlite3')
# conn.text_factory = lambda x: unicode(x, 'utf-8', 'ignore')
# c = conn.cursor()
#
# query2 = "select * from sh_margins order by opDate"
# df = pd.read_sql(query2, conn)
# cur = conn.cursor()
# query4 = "delete from sh_margins where rowid not in(select max(rowid) from sh_margins group by opDate)"
# cur.execute(query4)
# conn.commit()
#
# query2 = "select * from sz_margins order by opDate"
# df = pd.read_sql(query2, conn)
# cur = conn.cursor()
# query4 = "delete from sz_margins where rowid not in(select max(rowid) from sz_margins group by opDate)"
# cur.execute(query4)
# conn.commit()



########################更新历史趋势数据库################################
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
# if datetime.datetime.now().weekday() == 5:
#     today = str(pd.Timestamp(datetime.datetime.now()) - pd.Timedelta(days=1))[:10]
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


########################创建历史趋势数据库################################

#def creattrend_database():
# engine = create_engine('sqlite:////Users/liguoliang/UD78/src/db.sqlite3', echo=True)
# start = (datetime.datetime.today() - datetime.timedelta(180)).strftime("%Y-%m-%d")
# end = datetime.datetime.today().strftime("%Y-%m-%d")
# #存入数据库
# df=ts.sh_margins(start=start, end=end)
# df.to_sql('sh_margins',engine)
# df=ts.sz_margins(start=start, end=end)
# df.to_sql('sz_margins',engine)

