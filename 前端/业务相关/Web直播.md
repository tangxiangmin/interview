
参考
* https://blog.csdn.net/qq_34829447/article/details/83834796
* https://segmentfault.com/a/1190000010440054，这篇文章介绍的很详细

## 直播视频格式

* hls更准确的说是一种视频协议，文件对应的后缀是ts，适配Safari浏览器，是苹果推出的视频协议
* flv是早期的flash格式
* MP4和WEBM是偏点播使用的视频格式（如爱奇艺）
* TS和FLV是偏直播使用的视频格式（如斗鱼）

## 常用协议

* hls协议，播放器使用video作为点播和直播的基石（将M3U8索引文件[是ts文件的索引]给video进行播放，播放时会被解析成多个ts直播流片段，浏览器会实时向服务器请求M3U8文件里面是每个片段，之后会再次下载，之后会再次请求M3U8等等，从而保证直播的实时和连续）
* RTMP协议（开发客户端通常采用），TMP是Real Time Messaging Protocol（实时消息传输协议）的首字母缩写。该协议基于TCP，是一个协议族，包括RTMP基本协议及RTMPT/RTMPS/RTMPE等多种变种。RTMP是一种设计用来进行实时数据通信的网络协议，主要用来在Flash、AIR平台和支持RTMP协议的流媒体/交互服务器之间进行音视频和数据通信。
* HTTP-FLV协议（兼备RTMP低延时和HLS传输快的特性，视频格式是FLV）

### hls

接口返回一个hls的链接 ，然后交给客户端播放即可

todo