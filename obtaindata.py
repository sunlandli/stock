#!/usr/bin/python
# coding:utf-8
import tushare as ts
import datetime


print 'The tushare version is:',ts.__version__

#print ts.get_index()
#print ts.get_cpi()
#print ts.get_today_ticks('000751')



#df = ts.get_today_ticks('150019')
#print df.head(10)
today=datetime.date.today()
print today
#ISOFORMAT='%Y-%m-%d' #设置输出格式
#print today.strftime(ISOFORMAT)
#print ts.sh_margins(start='2017-07-01',end='2017-08-01')
print ts.sh_margin_details(start='2017-07-01',end='2017-08-01', symbol='601989')