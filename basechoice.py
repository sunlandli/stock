#!/usr/bin/python
#encoding:  utf-8

from sqlalchemy import create_engine
import tushare as ts
import sys,sqlite3
import pandas as pd
import matplotlib.pyplot as plt
import seaborn as sns
import seaborn.linearmodels as snsl

reload(sys)
sys.setdefaultencoding('utf8')


########################将基本股票数据读入到excel文件################################

# df=ts.get_stock_basics()         #旧接口，获取股票基本数据
# print df
# df.to_excel('//Users/liguoliang/UD78/src/basechoice.xlsx')  #读入到excel中

value =40   #定义小于多少亿市值
ToMarketday=20170401
path='//Users/liguoliang/UD78/src/市值小于' + str(value) +'亿.xlsx'
path1='//Users/liguoliang/UD78/src/排除新股市值小于' + str(value) +'亿.xlsx'
path2='//Users/liguoliang/UD78/src/高送转.xlsx'


#############  获取数据   #############
hq = ts.get_day_all()    #当前行情数据
# hq1 = ts.get_today_all()  #获取当前交易所有股票的行情数据   数据传输比较多
shares=ts.get_stock_basics()  #股票基本信息


#############  数据清洗、整理：方案   #############

# #--#############  方案1、选出指定市值：排除新股、指定市值的数据表合并
# hq=hq.set_index('code')
# basics=shares[['reservedPerShare','esp','timeToMarket']]  #选取每股公积金、EPS、和上市日期字段
# df=hq.merge(basics,left_index=True,right_index=True)      #合并两张表

# #--#############  方案2、选出高送转预期股票：考虑每股公积金、每股收益、流通股本和总市值四个因素，将公积金大于等于5元，每股收益大于等于5毛，流通股本在3亿以下，总市值在100亿以内作为高送转预期目标
# hq1['trade'] = hq1.apply(lambda x:x.settlement if x.trade==0 else x.trade, axis=1)  #当前股价,如果停牌则设置当前价格为上一个交易日股价
# basedata = shares[['outstanding', 'totals', 'reservedPerShare', 'esp']] #分别选取流通股本,总股本,每股公积金,每股收益
# hqdata = hq1[['code', 'name', 'trade', 'mktcap', 'nmc']]  #选取股票代码,名称,当前价格,总市值,流通市值
# hqdata = hqdata.set_index('code')  #设置行情数据code为index列
# data = basedata.merge(hqdata, left_index=True, right_index=True)  #合并两个数据表





#############  条件选投：条件   #############
# #--#############  方案1、选股条件:市值   #############
# nonews = df[(df.timeToMarket < ToMarketday) & (df.timeToMarket >0 ) ]  #排除新股后(选定在2017年1月1日前上市的公司)，查看当日涨跌幅排名前后的个股情况
# less= df[(df.abvalues < value)]   #包括所有股票小于指定市值
# less1= df[((df.timeToMarket < ToMarketday) & (df.timeToMarket >0 ) & (df.abvalues < value))]   #排除指定时间新股后，指定小于指定市值的

# #--#############  方案2、选股条件：高送转   #############
# data['mktcap'] = data['mktcap'] / 10000  #将总市值和流通市值换成亿元单位
# data['nmc'] = data['nmc'] / 10000
# res = data.reservedPerShare >= 5 #每股公积金>=5
# out = data.outstanding <= 30000 #流通股本<=3亿
# eps = data.esp >= 0.5 #每股收益>=5毛
# mktcap = data.mktcap <= 100 #总市值<100亿
# allcrit = res & out & eps & mktcap
# selected = data[allcrit]



#############  打印输出   #############
# print nonews
# # nonews.to_excel('//Users/liguoliang/UD78/src/日涨跌幅排名前后.xlsx')  ##排除市值输出，按日涨跌幅处理
# # less.to_excel(path)   ##排除市值输出
# less1.to_excel(path1)   ##排除新股、市值输出
# selected.to_excel(path2)  ##高送转输出