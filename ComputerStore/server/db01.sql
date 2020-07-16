#db01.sql

#功能二:商品列表  10:36
#1:向xz_laptop 商品列表中添加一列pic保存商品图片
USE xz;
ALTER TABLE xz_laptop ADD pic VARCHAR(255);
#2:更新pic列数据
UPDATE xz_laptop SET pic='01.png' WHERE lid = 1;
UPDATE xz_laptop SET pic='02.png' WHERE lid = 2;
UPDATE xz_laptop SET pic='03.png' WHERE lid = 3;
UPDATE xz_laptop SET pic='04.png' WHERE lid = 4;
UPDATE xz_laptop SET pic='05.png' WHERE lid = 5;
UPDATE xz_laptop SET pic='06.png' WHERE lid = 6;
UPDATE xz_laptop SET pic='07.png' WHERE lid = 7;
UPDATE xz_laptop SET pic='08.png' WHERE lid = 8;
UPDATE xz_laptop SET pic='09.png' WHERE lid = 9;
UPDATE xz_laptop SET pic='10.png' WHERE lid = 10;
UPDATE xz_laptop SET pic='11.png' WHERE lid = 11;
UPDATE xz_laptop SET pic='12.png' WHERE lid = 12;
UPDATE xz_laptop SET pic='13.png' WHERE lid = 13;
UPDATE xz_laptop SET pic='14.png' WHERE lid = 14;
UPDATE xz_laptop SET pic='15.png' WHERE lid = 15;
UPDATE xz_laptop SET pic='16.png' WHERE lid = 16;
UPDATE xz_laptop SET pic='17.png' WHERE lid = 17;
UPDATE xz_laptop SET pic='18.png' WHERE lid = 18;
UPDATE xz_laptop SET pic='19.png' WHERE lid = 19;
UPDATE xz_laptop SET pic='20.png' WHERE lid = 20;
UPDATE xz_laptop SET pic='11.png' WHERE lid > 20;
#3:复制mysql控制台执行生效(你操作)