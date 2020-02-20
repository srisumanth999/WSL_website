#!/usr/bin/env python


import pymysql.cursors

mydb = pymysql.Connect(
    host='db',
    user='root',
    passwd="rootpassword",
    port=3306
)
cursor = mydb.cursor()


cursor.execute("CREATE DATABASE IF NOT EXISTS wsldb;");
cursor.execute("USE wsldb;");
cursor.execute("CREATE TABLE IF NOT EXISTS roles(id int(15) NOT NULL AUTO_INCREMENT, gmail varchar(255) NOT NULL,permission varchar(255) ,PRIMARY KEY (id), UNIQUE KEY gmail (gmail))ENGINE=MyISAM  DEFAULT CHARSET=latin1 AUTO_INCREMENT=1;")
cursor.execute("CREATE TABLE IF NOT EXISTS map_ids(id int(15) NOT NULL AUTO_INCREMENT, description varchar(255) NOT NULL, dir varchar(255) NOT NULL, PRIMARY KEY (id) )ENGINE=MyISAM  DEFAULT CHARSET=latin1 AUTO_INCREMENT=101;")
cursor.execute("CREATE TABLE IF NOT EXISTS competencyResources(id varchar(255) NOT NULL,mapId int(15) NOT NULL,resource_id varchar(255),X float(17,14),Y float(17,14),old_Y float(17,14),indexes int(16),description TEXT,doc_volume float(17,14),topic_name varchar(256),topic_type varchar(256),topic_volume float(17,14),document_mapped_probability float(2,2),level int(15),norm_prob float(17,14),norm_x float(17,14),norm_y float(17,14),PRIMARY KEY (id),CONSTRAINT fk_roles FOREIGN KEY (mapId) REFERENCES roles(id) ON DELETE CASCADE )ENGINE=MyISAM  DEFAULT CHARSET=latin1;")
