#!/usr/bin/env python3
import requests
import json
import urllib3
import os
from dotenv import load_dotenv

class dwAPI:
    def __init__(self):
        load_dotenv()

        self._token = None
        self._baseurl = os.getenv("DW_URL")

        self._unsafe_ssl = os.getenv("DW_UNSAFE_SSL")

        if self._unsafe_ssl:
            urllib3.disable_warnings()

        self._device_names = None
        self._device_ids = None

    def login(self):
        j = {'username': os.getenv("DW_USERNAME"),
             'password': os.getenv("DW_PASSWORD"),
             'setCookie': True}

        r = requests.post(f'{self._baseurl}/rest/v1/login/sessions', json=j, verify=False if self._unsafe_ssl else True)
        try:
            rj = r.json()

            if 'error' in rj:
                print(f"Login error: {rj['errorString']}")
                self._token = None
                return False
            elif 'token' in rj:
                self._token = rj['token']
                return True

        except:
            print("login exception")
            return False

        return False

    def api_get(self, url, payload = {}):
        if self._token is None:
            raise Exception('no login token')

        h = {"authorization" : f"Bearer {self._token}"}
        r = requests.get(f"{self._baseurl}{url}", json=payload, headers=h, verify=False)

        return r

    def get_devices(self):
        dj = self.api_get('/rest/v1/devices?_with=id%2Cname')
        self._device_names = []
        self._device_ids = {}
        self._devices = []
        for dev in dj.json():
            self._device_names.append(dev['name'])
            self._device_ids[dev['name']] = dev['id']
            
        self._device_names.sort()

        for name in self._device_names:
            self._devices.append({"id": self._device_ids[name], "name": name})

    def device_names(self):
        return self._device_names

    def device_id(self, name):
        return self._device_ids[name]
    
    def devices(self):
        return self._devices
    
    def get_thumbnail(self, device_id, height=None, width=None):
        if height and height.isnumeric():
            r = self.api_get(f'/ec2/cameraThumbnail?cameraId={device_id}&height={height}&imageFormat=png')
        elif width and width.isnumeric():
            height = int(9 * int(width) / 16);
            r = self.api_get(f'/ec2/cameraThumbnail?cameraId={device_id}&height={height}&width={width}&imageFormat=png')
        return r.content   
    
if __name__ == "__main__":
    dw = dwAPI()

    dw.login()
    dw.get_devices()

    for dev in dw.device_names():
        print(f"{dev} -> {dw.device_id(dev)}")
