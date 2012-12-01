#!/usr/bin/python

import sys, os
from PySide import QtCore, QtGui
from PySide.QtWebKit import *

if __name__ == "__main__":
    app = QtGui.QApplication(sys.argv)

    width = 300
    height = 500

    print "file://" +   os.path.abspath(os.path.join(sys.argv[0], "..", "index.html"))
    print sys.argv

    #MainWindow = QtGui.QMainWindow(parent=None, flags=QtCore.Qt.FramelessWindowHint)
    MainWindow = QtGui.QMainWindow(parent=None)

    scene = QtGui.QGraphicsScene()
    view = QtGui.QGraphicsView(scene)

    MainWindow.setCentralWidget(view)


    view.setVerticalScrollBarPolicy(QtCore.Qt.ScrollBarAlwaysOff)
    view.setHorizontalScrollBarPolicy(QtCore.Qt.ScrollBarAlwaysOff)

    webview = QGraphicsWebView()

    webview.resize(width, height)
    webview.load(QtCore.QUrl(os.path.abspath(os.path.join(sys.argv[0], "..", "index.html"))))
    #webview.load(QtCore.QUrl("http://thismachine.info"))
    webview.setZoomFactor(1)

    webview.settings().setAttribute(QWebSettings.WebAttribute.DeveloperExtrasEnabled, True)
    webview.settings().setAttribute(QWebSettings.WebAttribute.LocalStorageEnabled, True)
    webview.settings().setAttribute(QWebSettings.WebAttribute.LocalContentCanAccessRemoteUrls, True)


    inspect = QWebInspector()
    inspect.setPage(webview.page())
    inspect.show()

    scene.addItem(webview)

    view.resize(width, height)
    view.show()

    view.setWindowTitle('Simple')

    MainWindow.show()

    sys.exit(app.exec_())
