#!/usr/bin/python
# coding: UTF-8

import sys, getopt,datetime
import tushare as ts

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

if __name__ == '__main__':
    day=sys.argv[1]
    print str(day)

