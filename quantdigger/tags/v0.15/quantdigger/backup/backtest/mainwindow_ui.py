# -*- coding: utf-8 -*-

# Form implementation generated from reading ui file 'mainwindow_ui.ui'
#
# Created: Wed Nov 26 17:14:54 2014
#      by: PyQt4 UI code generator 4.10.3
#
# WARNING! All changes made in this file will be lost!

from PyQt4 import QtCore, QtGui

try:
    _fromUtf8 = QtCore.QString.fromUtf8
except AttributeError:
    def _fromUtf8(s):
        return s

try:
    _encoding = QtGui.QApplication.UnicodeUTF8
    def _translate(context, text, disambig):
        return QtGui.QApplication.translate(context, text, disambig, _encoding)
except AttributeError:
    def _translate(context, text, disambig):
        return QtGui.QApplication.translate(context, text, disambig)

class Ui_MainWindow(object):
    def setupUi(self, MainWindow):
        MainWindow.setObjectName(_fromUtf8("MainWindow"))
        MainWindow.resize(1057, 678)
        self.centralwidget = QtGui.QWidget(MainWindow)
        self.centralwidget.setObjectName(_fromUtf8("centralwidget"))
        self.horizontalLayout = QtGui.QHBoxLayout(self.centralwidget)
        self.horizontalLayout.setObjectName(_fromUtf8("horizontalLayout"))
        self.tabWidget = QtGui.QTabWidget(self.centralwidget)
        self.tabWidget.setObjectName(_fromUtf8("tabWidget"))
        self.chartTab = QtGui.QWidget()
        self.chartTab.setObjectName(_fromUtf8("chartTab"))
        self.verticalLayout_3 = QtGui.QVBoxLayout(self.chartTab)
        self.verticalLayout_3.setObjectName(_fromUtf8("verticalLayout_3"))
        self.horizontalLayout_2 = QtGui.QHBoxLayout()
        self.horizontalLayout_2.setObjectName(_fromUtf8("horizontalLayout_2"))
        self.oneDayToolButton = QtGui.QToolButton(self.chartTab)
        self.oneDayToolButton.setCheckable(True)
        self.oneDayToolButton.setObjectName(_fromUtf8("oneDayToolButton"))
        self.buttonGroup = QtGui.QButtonGroup(MainWindow)
        self.buttonGroup.setObjectName(_fromUtf8("buttonGroup"))
        self.buttonGroup.addButton(self.oneDayToolButton)
        self.horizontalLayout_2.addWidget(self.oneDayToolButton)
        self.fiveDayToolButton = QtGui.QToolButton(self.chartTab)
        self.fiveDayToolButton.setCheckable(True)
        self.fiveDayToolButton.setObjectName(_fromUtf8("fiveDayToolButton"))
        self.buttonGroup.addButton(self.fiveDayToolButton)
        self.horizontalLayout_2.addWidget(self.fiveDayToolButton)
        self.oneMonthToolButton = QtGui.QToolButton(self.chartTab)
        self.oneMonthToolButton.setCheckable(True)
        self.oneMonthToolButton.setObjectName(_fromUtf8("oneMonthToolButton"))
        self.buttonGroup.addButton(self.oneMonthToolButton)
        self.horizontalLayout_2.addWidget(self.oneMonthToolButton)
        self.threeMonthToolButton = QtGui.QToolButton(self.chartTab)
        self.threeMonthToolButton.setCheckable(True)
        self.threeMonthToolButton.setObjectName(_fromUtf8("threeMonthToolButton"))
        self.buttonGroup.addButton(self.threeMonthToolButton)
        self.horizontalLayout_2.addWidget(self.threeMonthToolButton)
        self.sixMonthToolButton = QtGui.QToolButton(self.chartTab)
        self.sixMonthToolButton.setCheckable(True)
        self.sixMonthToolButton.setObjectName(_fromUtf8("sixMonthToolButton"))
        self.buttonGroup.addButton(self.sixMonthToolButton)
        self.horizontalLayout_2.addWidget(self.sixMonthToolButton)
        self.oneYearToolButton = QtGui.QToolButton(self.chartTab)
        self.oneYearToolButton.setCheckable(True)
        self.oneYearToolButton.setObjectName(_fromUtf8("oneYearToolButton"))
        self.buttonGroup.addButton(self.oneYearToolButton)
        self.horizontalLayout_2.addWidget(self.oneYearToolButton)
        self.twoYearToolButton = QtGui.QToolButton(self.chartTab)
        self.twoYearToolButton.setCheckable(True)
        self.twoYearToolButton.setObjectName(_fromUtf8("twoYearToolButton"))
        self.buttonGroup.addButton(self.twoYearToolButton)
        self.horizontalLayout_2.addWidget(self.twoYearToolButton)
        self.fiveYearToolButton = QtGui.QToolButton(self.chartTab)
        self.fiveYearToolButton.setCheckable(True)
        self.fiveYearToolButton.setObjectName(_fromUtf8("fiveYearToolButton"))
        self.buttonGroup.addButton(self.fiveYearToolButton)
        self.horizontalLayout_2.addWidget(self.fiveYearToolButton)
        self.maxToolButton = QtGui.QToolButton(self.chartTab)
        self.maxToolButton.setCheckable(True)
        self.maxToolButton.setChecked(True)
        self.maxToolButton.setObjectName(_fromUtf8("maxToolButton"))
        self.buttonGroup.addButton(self.maxToolButton)
        self.horizontalLayout_2.addWidget(self.maxToolButton)
        self.line_2 = QtGui.QFrame(self.chartTab)
        self.line_2.setFrameShape(QtGui.QFrame.VLine)
        self.line_2.setFrameShadow(QtGui.QFrame.Sunken)
        self.line_2.setObjectName(_fromUtf8("line_2"))
        self.horizontalLayout_2.addWidget(self.line_2)
        self.styleToolButton = QtGui.QToolButton(self.chartTab)
        self.styleToolButton.setCursor(QtGui.QCursor(QtCore.Qt.ArrowCursor))
        self.styleToolButton.setContextMenuPolicy(QtCore.Qt.ActionsContextMenu)
        self.styleToolButton.setPopupMode(QtGui.QToolButton.InstantPopup)
        self.styleToolButton.setArrowType(QtCore.Qt.NoArrow)
        self.styleToolButton.setObjectName(_fromUtf8("styleToolButton"))
        self.horizontalLayout_2.addWidget(self.styleToolButton)
        self.line_3 = QtGui.QFrame(self.chartTab)
        self.line_3.setFrameShape(QtGui.QFrame.VLine)
        self.line_3.setFrameShadow(QtGui.QFrame.Sunken)
        self.line_3.setObjectName(_fromUtf8("line_3"))
        self.horizontalLayout_2.addWidget(self.line_3)
        self.indicatorToolButton = QtGui.QToolButton(self.chartTab)
        self.indicatorToolButton.setContextMenuPolicy(QtCore.Qt.ActionsContextMenu)
        self.indicatorToolButton.setPopupMode(QtGui.QToolButton.InstantPopup)
        self.indicatorToolButton.setToolButtonStyle(QtCore.Qt.ToolButtonIconOnly)
        self.indicatorToolButton.setObjectName(_fromUtf8("indicatorToolButton"))
        self.horizontalLayout_2.addWidget(self.indicatorToolButton)
        spacerItem = QtGui.QSpacerItem(40, 20, QtGui.QSizePolicy.Expanding, QtGui.QSizePolicy.Minimum)
        self.horizontalLayout_2.addItem(spacerItem)
        self.symbolLineEdit = QtGui.QLineEdit(self.chartTab)
        self.symbolLineEdit.setObjectName(_fromUtf8("symbolLineEdit"))
        self.horizontalLayout_2.addWidget(self.symbolLineEdit)
        self.pushButton = QtGui.QPushButton(self.chartTab)
        self.pushButton.setObjectName(_fromUtf8("pushButton"))
        self.horizontalLayout_2.addWidget(self.pushButton)
        self.verticalLayout_3.addLayout(self.horizontalLayout_2)
        self.matplotlibWidget = MatplotlibWidget(self.chartTab)
        sizePolicy = QtGui.QSizePolicy(QtGui.QSizePolicy.Preferred, QtGui.QSizePolicy.MinimumExpanding)
        sizePolicy.setHorizontalStretch(0)
        sizePolicy.setVerticalStretch(0)
        sizePolicy.setHeightForWidth(self.matplotlibWidget.sizePolicy().hasHeightForWidth())
        self.matplotlibWidget.setSizePolicy(sizePolicy)
        self.matplotlibWidget.setContextMenuPolicy(QtCore.Qt.CustomContextMenu)
        self.matplotlibWidget.setObjectName(_fromUtf8("matplotlibWidget"))
        self.verticalLayout_3.addWidget(self.matplotlibWidget)
        self.tabWidget.addTab(self.chartTab, _fromUtf8(""))
        self.statsTab = QtGui.QWidget()
        self.statsTab.setObjectName(_fromUtf8("statsTab"))
        self.tabWidget.addTab(self.statsTab, _fromUtf8(""))
        self.horizontalLayout.addWidget(self.tabWidget)
        MainWindow.setCentralWidget(self.centralwidget)
        self.statusbar = QtGui.QStatusBar(MainWindow)
        self.statusbar.setObjectName(_fromUtf8("statusbar"))
        MainWindow.setStatusBar(self.statusbar)
        self.dockWidget = QtGui.QDockWidget(MainWindow)
        self.dockWidget.setObjectName(_fromUtf8("dockWidget"))
        self.dockWidgetContents = QtGui.QWidget()
        self.dockWidgetContents.setObjectName(_fromUtf8("dockWidgetContents"))
        self.verticalLayout_2 = QtGui.QVBoxLayout(self.dockWidgetContents)
        self.verticalLayout_2.setObjectName(_fromUtf8("verticalLayout_2"))
        self.verticalLayout = QtGui.QVBoxLayout()
        self.verticalLayout.setObjectName(_fromUtf8("verticalLayout"))
        self.strategyListWidget = QtGui.QListWidget(self.dockWidgetContents)
        self.strategyListWidget.setContextMenuPolicy(QtCore.Qt.CustomContextMenu)
        self.strategyListWidget.setObjectName(_fromUtf8("strategyListWidget"))
        self.verticalLayout.addWidget(self.strategyListWidget)
        self.label = QtGui.QLabel(self.dockWidgetContents)
        self.label.setObjectName(_fromUtf8("label"))
        self.verticalLayout.addWidget(self.label)
        self.dateStartEdit = QtGui.QDateEdit(self.dockWidgetContents)
        self.dateStartEdit.setFocusPolicy(QtCore.Qt.NoFocus)
        self.dateStartEdit.setDate(QtCore.QDate(2011, 1, 1))
        self.dateStartEdit.setCalendarPopup(True)
        self.dateStartEdit.setTimeSpec(QtCore.Qt.LocalTime)
        self.dateStartEdit.setObjectName(_fromUtf8("dateStartEdit"))
        self.verticalLayout.addWidget(self.dateStartEdit)
        self.label_2 = QtGui.QLabel(self.dockWidgetContents)
        self.label_2.setObjectName(_fromUtf8("label_2"))
        self.verticalLayout.addWidget(self.label_2)
        self.dateEndEdit = QtGui.QDateEdit(self.dockWidgetContents)
        self.dateEndEdit.setFocusPolicy(QtCore.Qt.NoFocus)
        self.dateEndEdit.setDate(QtCore.QDate(2012, 1, 1))
        self.dateEndEdit.setCalendarPopup(True)
        self.dateEndEdit.setObjectName(_fromUtf8("dateEndEdit"))
        self.verticalLayout.addWidget(self.dateEndEdit)
        self.label_3 = QtGui.QLabel(self.dockWidgetContents)
        self.label_3.setObjectName(_fromUtf8("label_3"))
        self.verticalLayout.addWidget(self.label_3)
        self.initialCashSpinBox = QtGui.QSpinBox(self.dockWidgetContents)
        self.initialCashSpinBox.setFocusPolicy(QtCore.Qt.NoFocus)
        self.initialCashSpinBox.setFrame(True)
        self.initialCashSpinBox.setButtonSymbols(QtGui.QAbstractSpinBox.UpDownArrows)
        self.initialCashSpinBox.setMaximum(999999999)
        self.initialCashSpinBox.setProperty("value", 50000000)
        self.initialCashSpinBox.setObjectName(_fromUtf8("initialCashSpinBox"))
        self.verticalLayout.addWidget(self.initialCashSpinBox)
        spacerItem1 = QtGui.QSpacerItem(20, 40, QtGui.QSizePolicy.Minimum, QtGui.QSizePolicy.Expanding)
        self.verticalLayout.addItem(spacerItem1)
        self.verticalLayout_2.addLayout(self.verticalLayout)
        self.dockWidget.setWidget(self.dockWidgetContents)
        MainWindow.addDockWidget(QtCore.Qt.DockWidgetArea(1), self.dockWidget)
        self.menuBar = QtGui.QMenuBar(MainWindow)
        self.menuBar.setGeometry(QtCore.QRect(0, 0, 1057, 25))
        self.menuBar.setObjectName(_fromUtf8("menuBar"))
        self.menu_View = QtGui.QMenu(self.menuBar)
        self.menu_View.setObjectName(_fromUtf8("menu_View"))
        self.menu_Settings = QtGui.QMenu(self.menuBar)
        self.menu_Settings.setObjectName(_fromUtf8("menu_Settings"))
        MainWindow.setMenuBar(self.menuBar)
        self.actionExit = QtGui.QAction(MainWindow)
        self.actionExit.setObjectName(_fromUtf8("actionExit"))
        self.actionTest3 = QtGui.QAction(MainWindow)
        self.actionTest3.setObjectName(_fromUtf8("actionTest3"))
        self.actionTest5 = QtGui.QAction(MainWindow)
        self.actionTest5.setObjectName(_fromUtf8("actionTest5"))
        self.actionExit_2 = QtGui.QAction(MainWindow)
        self.actionExit_2.setObjectName(_fromUtf8("actionExit_2"))
        self.actionLineChart = QtGui.QAction(MainWindow)
        self.actionLineChart.setObjectName(_fromUtf8("actionLineChart"))
        self.actionBacktest_Window = QtGui.QAction(MainWindow)
        self.actionBacktest_Window.setCheckable(True)
        self.actionBacktest_Window.setChecked(True)
        self.actionBacktest_Window.setObjectName(_fromUtf8("actionBacktest_Window"))
        self.actionPerference = QtGui.QAction(MainWindow)
        self.actionPerference.setObjectName(_fromUtf8("actionPerference"))
        self.actionRunStrategy = QtGui.QAction(MainWindow)
        icon = QtGui.QIcon()
        icon.addPixmap(QtGui.QPixmap(_fromUtf8(":/icons/run.png")), QtGui.QIcon.Normal, QtGui.QIcon.Off)
        self.actionRunStrategy.setIcon(icon)
        self.actionRunStrategy.setObjectName(_fromUtf8("actionRunStrategy"))
        self.actionEditStrategy = QtGui.QAction(MainWindow)
        icon1 = QtGui.QIcon()
        icon1.addPixmap(QtGui.QPixmap(_fromUtf8(":/icons/edit.png")), QtGui.QIcon.Normal, QtGui.QIcon.Off)
        self.actionEditStrategy.setIcon(icon1)
        self.actionEditStrategy.setObjectName(_fromUtf8("actionEditStrategy"))
        self.menu_View.addAction(self.actionBacktest_Window)
        self.menu_Settings.addAction(self.actionPerference)
        self.menuBar.addAction(self.menu_View.menuAction())
        self.menuBar.addAction(self.menu_Settings.menuAction())

        self.retranslateUi(MainWindow)
        self.tabWidget.setCurrentIndex(0)
        QtCore.QObject.connect(self.actionBacktest_Window, QtCore.SIGNAL(_fromUtf8("toggled(bool)")), self.dockWidget.setVisible)
        QtCore.QObject.connect(self.dockWidget, QtCore.SIGNAL(_fromUtf8("visibilityChanged(bool)")), self.actionBacktest_Window.setChecked)
        QtCore.QMetaObject.connectSlotsByName(MainWindow)

    def retranslateUi(self, MainWindow):
        MainWindow.setWindowTitle(_translate("MainWindow", "Backtester", None))
        self.oneDayToolButton.setText(_translate("MainWindow", "1d", None))
        self.fiveDayToolButton.setText(_translate("MainWindow", "5d", None))
        self.oneMonthToolButton.setText(_translate("MainWindow", "1m", None))
        self.threeMonthToolButton.setText(_translate("MainWindow", "3m", None))
        self.sixMonthToolButton.setText(_translate("MainWindow", "6m", None))
        self.oneYearToolButton.setText(_translate("MainWindow", "1y", None))
        self.twoYearToolButton.setText(_translate("MainWindow", "2y", None))
        self.fiveYearToolButton.setText(_translate("MainWindow", "5y", None))
        self.maxToolButton.setText(_translate("MainWindow", "Max", None))
        self.styleToolButton.setText(_translate("MainWindow", "Style", None))
        self.indicatorToolButton.setText(_translate("MainWindow", "+Indicator", None))
        self.pushButton.setText(_translate("MainWindow", "+Comparison", None))
        self.tabWidget.setTabText(self.tabWidget.indexOf(self.chartTab), _translate("MainWindow", "Chart", None))
        self.tabWidget.setTabText(self.tabWidget.indexOf(self.statsTab), _translate("MainWindow", "Statistics", None))
        self.dockWidget.setWindowTitle(_translate("MainWindow", "Backtest Panel", None))
        self.label.setText(_translate("MainWindow", "Start", None))
        self.dateStartEdit.setDisplayFormat(_translate("MainWindow", "MM/dd/yyyy", None))
        self.label_2.setText(_translate("MainWindow", "End", None))
        self.dateEndEdit.setDisplayFormat(_translate("MainWindow", "MM/dd/yyyy", None))
        self.label_3.setText(_translate("MainWindow", "Initial Cash", None))
        self.initialCashSpinBox.setPrefix(_translate("MainWindow", "$ ", None))
        self.menu_View.setTitle(_translate("MainWindow", "&View", None))
        self.menu_Settings.setTitle(_translate("MainWindow", "&Settings", None))
        self.actionExit.setText(_translate("MainWindow", "Exit", None))
        self.actionTest3.setText(_translate("MainWindow", "test3", None))
        self.actionTest5.setText(_translate("MainWindow", "test5", None))
        self.actionExit_2.setText(_translate("MainWindow", "Exit", None))
        self.actionLineChart.setText(_translate("MainWindow", "LineChart", None))
        self.actionBacktest_Window.setText(_translate("MainWindow", "Backtest Panel", None))
        self.actionPerference.setText(_translate("MainWindow", "Preferences...", None))
        self.actionRunStrategy.setText(_translate("MainWindow", "Run Strategy", None))
        self.actionEditStrategy.setText(_translate("MainWindow", "Edit Strategy", None))

from matplotlibwidget import MatplotlibWidget
import resource_rc
