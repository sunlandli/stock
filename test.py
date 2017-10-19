#!/usr/bin/python
# coding: UTF-8

import sys, getopt,datetime
import tushare as ts
import sys,sqlite3


#
# import tushare as ts
# import pandas as pd
# df=ts.get_hist_data('600415',start='2015-04-01',end='2015-06-18')
# # 所有的结果汇图
# df.plot()
# # 只将stock最高值进行汇图
# df.high.plot()
# # 指定绘图的四个量，并指定线条颜色
# with pd.plot_params.use('x_compat', True):
#     df.open.plot(color='g')
#     df.close.plot(color='y')
#     df.high.plot(color='r')
#     df.low.plot(color='b')
# # 指定绘图的长宽尺度及背景网格
# with pd.plot_params.use('x_compat', True):
#     df.high.plot(color='r',figsize=(10,4),grid='on')
#     df.low.plot(color='b',figsize=(10,4),grid='on')
#
# print











##获取参数
# def main(argv):
#    inputfile = ''
#    outputfile = ''
#    try:
#       opts, args = getopt.getopt(argv,"hi:o:",["ifile=","ofile="])
#    except getopt.GetoptError:
#       print 'test.py -i <inputfile> -o <outputfile>'
#       sys.exit(2)
#    for opt, arg in opts:
#       if opt == '-h':
#          print 'test.py -i <inputfile> -o <outputfile>'
#          sys.exit()
#       elif opt in ("-i", "--ifile"):
#          inputfile = arg
#       elif opt in ("-o", "--ofile"):
#          outputfile = arg
#    print '输入的文件为：', inputfile
#    print '输出的文件为：', outputfile
#    print opts
#
# if __name__ == "__main__":
#    main(sys.argv[1:])
#    print '参数个数为:', len(sys.argv), '个参数。'
#    print '参数列表:', str(sys.argv)



##  This script parse stock info”””
# import tushare as ts
# def get_all_price(code_list):
#     ##process all stock
#     df = ts.get_realtime_quotes(STOCK)
#     print df
# if __name__ == '__main__':
#     STOCK = ['600219',       ##南山铝业
#              '000002',       ##万  科Ａ
#              '000623',       ##吉林敖东
#              '000725',       ##京东方Ａ
#              '600036',       ##招商银行
#              '601166',       ##兴业银行
#              '600298',       ##安琪酵母
#              '600881',       ##亚泰集团
#              '002582',       ##好想你
#              '600750',       ##江中药业
#              '601088',       ##中国神华
#              '000338',       ##潍柴动力
#              '000895',       ##双汇发展
#              '000792']       ##盐湖股份
#     get_all_price(STOCK)


#策略：以20日线为标准，当前股价低于20日线的时候就卖出，高于20日线的时候就买入。
# def parse(code_list):
#     ##””’process stock”’
#     is_buy    = 0
#     buy_val   = []
#     buy_date  = []
#     sell_val  = []
#     sell_date = []
#     df = ts.get_hist_data(STOCK)
#     ma20 = df[u'ma20']
#     close = df[u'close']
#     rate = 1.0
#     idx = len(ma20)
#     while idx > 0:
#         idx -= 1
#         close_val = close[idx]
#         ma20_val = ma20[idx]
#         if close_val > ma20_val:
#                 if is_buy == 0:
#                         is_buy = 1
#                         buy_val.append(close_val)
#                         buy_date.append(close.keys()[idx])
#         elif close_val < ma20_val:
#                 if is_buy == 1:
#                         is_buy = 0
#                         sell_val.append(close_val)
#                         sell_date.append(close.keys()[idx])
#     print 'stock number: %s' %STOCK
#     print 'buy count   : %d' %len(buy_val)
#     print 'sell count  : %d' %len(sell_val)
#     for i in range(len(sell_val)):
#         rate = rate * (sell_val[i] * (1 - 0.002) / buy_val[i])
#         print 'buy date : %s, buy price : %.2f' %(buy_date[i], buy_val[i])
#         print 'sell date: %s, sell price: %.2f' %(sell_date[i], sell_val[i])
#     print 'rate: %.2f' % rate
# if __name__ == '__main__':
#     STOCK = '150019'       ##浦发银行
#     parse(STOCK)

#画图
# import numpy as np
# import matplotlib.pyplot as plt
#
# plt.figure(1)  # 创建图表1
# plt.figure(2)  # 创建图表2
# ax1 = plt.subplot(211)  # 在图表2中创建子图1
# ax2 = plt.subplot(212)  # 在图表2中创建子图2
#
# x = np.linspace(0, 3, 100)
# for i in xrange(5):
#     plt.figure(1)  # ❶ # 选择图表1
#     plt.plot(x, np.exp(i * x / 3))
#     plt.sca(ax1)  # ❷ # 选择图表2的子图1
#     plt.plot(x, np.sin(i * x))
#     plt.sca(ax2)  # 选择图表2的子图2
#     plt.plot(x, np.cos(i * x))
#
# plt.show()

#测试获取数据，观察用
# days=30
# start = datetime.date.today()-datetime.timedelta(days)
# #print start.strftime("%Y-%m-%d")
# end = datetime.date.today().strftime("%Y-%m-%d")
# shma=ts.sh_margins(start=start.strftime("%Y-%m-%d"), end=end)
# szma=ts.sz_margins(start=start.strftime("%Y-%m-%d"), end=end)
# print 'te'
#
# # if __name__ == '__main__':
# #     day=sys.argv[1]
# #     print str(day)
#
#
#
# import matplotlib.pyplot as plt
# labels='frogs','hogs','dogs','logs'
# sizes=15,20,45,10
# colors='yellowgreen','gold','lightskyblue','lightcoral'
# explode=0,0.1,0,0
# plt.pie(sizes,explode=explode,labels=labels,colors=colors,autopct='%1.1f%%',shadow=True,startangle=50)
# plt.axis('equal')
# plt.show()
#
# print ''

# import numpy as np
# from sklearn.model_selection import cross_val_score
# from sklearn import datasets, svm
#
# digits = datasets.load_digits()
# X = digits.data
# y = digits.target
#
# svc = svm.SVC(kernel='linear')
# C_s = np.logspace(-10, 0, 10)
#
# scores = list()
# scores_std = list()
# for C in C_s:
#     svc.C = C
#     this_scores = cross_val_score(svc, X, y, n_jobs=1)
#     scores.append(np.mean(this_scores))
#     scores_std.append(np.std(this_scores))
#
# # Do the plotting
# import matplotlib.pyplot as plt
# plt.figure(1, figsize=(4, 3))
# plt.clf()
# plt.semilogx(C_s, scores)
# plt.semilogx(C_s, np.array(scores) + np.array(scores_std), 'b--')
# plt.semilogx(C_s, np.array(scores) - np.array(scores_std), 'b--')
# locs, labels = plt.yticks()
# plt.yticks(locs, list(map(lambda x: "%g" % x, locs)))
# plt.ylabel('CV score')
# plt.xlabel('Parameter C')
# plt.ylim(0, 1.1)
# plt.show()


# from pandas import Series,DataFrame
# import pandas as pd
#
# s=Series(["aaaa","bbbb","cccc",1111])
# print s
# print s.values
# print s.index
# print s[1] + s[2]
#
# data = {"name":["yahoo","google","facebook"], "marks":[200,400,800], "price":[9, 3, 7]}
# f1 = DataFrame(data)
# print f1




# import socket
# import time
# import string
# import math
# import re
# import os
# import json
# import subprocess
# import collections
#
# def get_uptime():
# 	f = open('/proc/uptime', 'r')
# 	uptime = f.readline()
# 	f.close()
# 	uptime = uptime.split('.', 2)
# 	time = int(uptime[0])
# 	return int(time)
#
# if __name__ == '__main__':
#     get_uptime()



import tushare as ts

df=ts.get_stock_basics()
print df