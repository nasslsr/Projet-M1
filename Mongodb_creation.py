#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Created on Tue Mar 21 17:55:24 2023

@author: nass
"""
import pymongo
from pymongo import MongoClient
from collect_data import collect_and_merge_data



#mycol.create_index([('last_reported',-1)])


def connection_DB():
    
    connection_string='mongodb://127.0.0.1:27017/?directConnection=true&serverSelectionTimeoutMS=2000&appName=mongosh+1.8.0'
    client = pymongo.MongoClient(connection_string)
    
    
    if client:
        print("successful connection")
        return client
    else:
        print("Unable to connect to MongoDB.")
        
  
        

def create_DB(client):
    
    
   DB_name = input("Enter a name for your DATABASE : ")
   mydb = client[DB_name]
    
   dblist = client.list_database_names()
   if DB_name in dblist:
       print("The database exists.")
       
      
   return mydb

    
 
    
def create_Collection(mydb):
    
    
    Collection_name=input("Enter a name for your Collection  : ")
    mycol = mydb[Collection_name]
    
    collist = mydb.list_collection_names()
    
    if Collection_name in collist:
        print("The collection exists.")
        
        
    return mycol
    

    
def insert_Data():
    client = connection_DB()
    mydb= create_DB(client)
    mycol= create_Collection(mydb)
    
    dictionnary_of_data = collect_and_merge_data()

    for one_dictionnary in dictionnary_of_data :
        x = mycol.insert_one(one_dictionnary)
        


def create_index(mycol):
    
    # Créer un index sur le champ 'last_reported' en ordre décroissant
    mycol.create_index([('last_reported', pymongo.DESCENDING)])
    
    # Afficher la liste des index de la collection
    print(f"Les index actuels de la collection '{mycol.name}' sont :")
    print(mycol.index_information())

    
 if __name__ == '__main__':
    insert_Data()
    create_index()

    
