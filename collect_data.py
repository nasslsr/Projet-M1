#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Created on Tue Mar 21 16:01:27 2023

@author: nass
"""
import requests




url_station_information='https://velib-metropole-opendata.smoove.pro/opendata/Velib_Metropole/station_information.json'

url_station_status='https://velib-metropole-opendata.smoove.pro/opendata/Velib_Metropole/station_status.json'


def collect_data_localization(url_station_information):
    
    
    request_result = requests.get(url_station_information)
    request_data= request_result.json()
    
    information_localization = request_data['data']['stations']
  
    data_localization_information=[]
    
    for data in information_localization:
            data_localization = {"station_id" : data['station_id'],
                                     "name" : data['name'],
                                    "geographic_lat" : data['lat'],
                                    "geographic_lon" :  data['lon'],
                                    "capacity" : data['capacity'],
                                     "stationCode" : data['stationCode']}
            data_localization_information.append(data_localization)
            
          
    return data_localization_information




            



def collect_data_availability_velib_terminal(url_station_status):    
    
    request_result = requests.get(url_station_status)
    request_data= request_result.json()
    
    information_stations = request_data['data']['stations']
  
    data_availability_information=[]
    
    for data in information_stations:
            data_availability = {"stationCode" : data['stationCode'],
                                "station_id" : data['station_id'],
                                "num_bikes_available" : data['num_bikes_available'],
                                    "numBikesAvailable" : data['numBikesAvailable'],
                                    "num_bikes_available_types" :  data['num_bikes_available_types'],
                                    "num_docks_available" : data['num_docks_available'],
                                     "numDocksAvailable" : data['numDocksAvailable'],
                                     "is_installed" : data['is_installed'],
                                     "is_returning" : data['is_returning'],
                                     "is_renting" : data['is_renting'],
                                     "last_reported" : data['last_reported']}
            data_availability_information.append(data_availability)
            
    return data_availability_information
            







def collect_and_merge_data():
    request_result = requests.get(url_station_information)
    request_data = request_result.json()
    information_localization = request_data['data']['stations']
    
    request_result_2 = requests.get(url_station_status)
    request_data_2 = request_result_2.json()
    information_stations = request_data_2['data']['stations']
    
    # combiner les deux listes en tuple ex: languages = ['Java', 'Python', 'JavaScript']  versions = [14, 3, 6] donne  [('Java', 14), ('Python', 3), ('JavaScript', 6)]
    combined_list = list(zip(information_localization, information_stations))
    
    # créer un nouveau dictionnaire en mettant toutes les informations des indices 0 ensemble puis des indcies 1 enselble etc 
    #localization parcourt le tuple des données de loca et status parcourt le tuple des données de status
    all_data_information = []
    for localization, status in combined_list:
        
        all_data = {
            "station_id":localization['station_id'],
            "name": localization['name'],
            "geographic_lat": localization['lat'],
            "geographic_lon": localization['lon'],
            "capacity": localization['capacity'],
            "stationCode": localization['stationCode'],
            "num_bikes_available": status['num_bikes_available'],
            "numBikesAvailable" : status['numBikesAvailable'],
            "num_bikes_available_types": status['num_bikes_available_types'],
            "num_docks_available": status['num_docks_available'],
            "numDocksAvailable" : status['numDocksAvailable'],
            "is_installed": status['is_installed'],
            "is_returning": status['is_returning'],
            "is_renting": status['is_renting'],
            "last_reported ": status['last_reported']
            
        }
        all_data_information.append(all_data)
    return all_data_information


if __name__ == '__main__':
    collect_and_merge_data()



















    
