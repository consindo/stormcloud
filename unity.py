#!/usr/bin/env python
import socket

"""
Basic TCP Server because #YOLO
Well, not really. Just the easiest way to communicate from node to python
"""

print "hey"

TCP_IP = '127.0.0.1'
TCP_PORT = 7691
BUFFER_SIZE = 20  # Normally 1024, but we want fast response

s = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
s.bind((TCP_IP, TCP_PORT))
s.listen(1)

while 1:
	conn, addr = s.accept()
	print 'Connection address:', addr
	while 1:
	    data = conn.recv(BUFFER_SIZE)
	    if not data: break
	    print "received data:", data
	    conn.send("success")
	conn.close()
