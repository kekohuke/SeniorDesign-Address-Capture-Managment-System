import requests
import xml.etree.ElementTree as ET
import re
from csv import QUOTE_ALL, DictWriter


def send_request(dictionary):
    url = "https://onlinetools.ups.com/webservices/XAV"
    headers = {'content-type': 'application/soap+xml'}
    body = ("<envr:Envelope xmlns:auth=\"http://www.ups.com/schema/xpci/1.0/auth\"\n"
            "    xmlns:envr=\"http://schemas.xmlsoap.org/soap/envelope/\"\n"
            "    xmlns:xsd=\"http://www.w3.org/2001/XMLSchema\"\n"
            "    xmlns:upss=\"http://www.ups.com/XMLSchema/XOLTWS/UPSS/v1.0\"\n"
            "    xmlns:common=\"http://www.ups.com/XMLSchema/XOLTWS/Common/v1.0\"\n"
            "    xmlns:xsi=\"http://www.w3.org/2001/XMLSchema-instance\">\n"
            "        <envr:Header>\n"
            "            <upss:UPSSecurity>\n"
            "                <upss:UsernameToken>\n"
            "                    <upss:Username>xwang296</upss:Username>\n"
            "                    <upss:Password>Chao0919</upss:Password>\n"
            "                </upss:UsernameToken>\n"
            "                <upss:ServiceAccessToken>\n"
            "                    <upss:AccessLicenseNumber>0D6E642A502FE015</upss:AccessLicenseNumber>\n"
            "                </upss:ServiceAccessToken>\n"
            "            </upss:UPSSecurity>\n"
            "        </envr:Header>\n"
            "        <envr:Body>\n"
            "            <XAV:XAVRequest xsi:schemaLocation=\"http://www.ups.com/XMLSchema/XOLTWS/xav/v1.0\"\n"
            "    xmlns:XAV=\"http://www.ups.com/XMLSchema/XOLTWS/xav/v1.0\">\n"
            "                <common:Request>\n"
            "                    <common:RequestOption>1</common:RequestOption>\n"
            "                </common:Request>\n"
            "                <XAV:MaximumListSize>10</XAV:MaximumListSize>\n"
            "                <XAV:AddressKeyFormat>\n"
            "                    <XAV:AddressLine>%s</XAV:AddressLine>\n"
            "                    <XAV:PoliticalDivision2>%s</XAV:PoliticalDivision2>\n"
            "                    <XAV:PoliticalDivision1>%s</XAV:PoliticalDivision1>\n"
            "                    <XAV:PostcodePrimaryLow>%s</XAV:PostcodePrimaryLow>\n"
            "                    <XAV:CountryCode>%s</XAV:CountryCode>\n"
            "                </XAV:AddressKeyFormat>\n"
            "            </XAV:XAVRequest>\n"
            "        </envr:Body>\n"
            "    </envr:Envelope>") % (dictionary["AddressLine"], dictionary["City"], dictionary["State"],
                                       dictionary["Zip"], dictionary["Country"])
    response = requests.post(url, data=body, headers=headers)
    return ET.fromstring(response.content)


def parse_etree(xml_etree):
    my_dict = {}
    if re.sub("[\{].*?[\}]", "", xml_etree[1][0].tag) == "XAVResponse":
        if xml_etree[1][0][0][0][1].text == "Success":
            if re.sub("[\{].*?[\}]", "", xml_etree[1][0][1].tag) == "ValidAddressIndicator":
                my_dict["Validation"] = True
                for element in xml_etree[1][0][2]:
                    for each in element:
                        my_dict[re.sub("[\{].*?[\}]", "", each.tag)] = each.text
            else:
                my_dict["Validation"] = False
    else:
        my_dict[re.sub("[\{].*?[\}]", "", xml_etree[1][0][0].tag)] = xml_etree[1][0][0].text
        my_dict[re.sub("[\{].*?[\}]", "", xml_etree[1][0][1].tag)] = xml_etree[1][0][1].text
        my_dict[re.sub("[\{].*?[\}]", "", xml_etree[1][0][2][0][0][0].tag)] = xml_etree[1][0][2][0][0][0].text
        my_dict[re.sub("[\{].*?[\}]", "", xml_etree[1][0][2][0][0][1][0].tag)] = xml_etree[1][0][2][0][0][1][0].text
        my_dict[re.sub("[\{].*?[\}]", "", xml_etree[1][0][2][0][0][1][1].tag)] = xml_etree[1][0][2][0][0][1][1].text
    with open("data.csv", 'w') as csvfile:
        csvwriter = DictWriter(csvfile, fieldnames=my_dict.keys(), quoting=QUOTE_ALL)
        csvwriter.writeheader()
        csvwriter.writerows(my_dict)
    return my_dict


def read_text(path):
    f = open(path, "r")
    if f.mode == "r":
        return f.readlines()
    else:
        print("Wrong Path")


def read_and_post():
    with open("street_stop_word.txt") as f:
        content = f.readlines()
    street_stop_word = [x.strip() for x in content]
    f = open("states.txt")
    if f.mode == 'r':
        states_stop_word = f.read().lower()
    data_path = "../Google_sample/result.txt"
    addresses = read_text(data_path)
    address_line = ""
    city = ""
    state = ""
    zip_code = ""
    country = "US"
    address_dict = {}
    for each in addresses:
        city = ""
        if "\n" in each:
            each = each[0: -2].lower()  # remove "/n and lower case"
            word_list = each.split()
            zip_code = word_list[-1]  # zip code get
            each = each.rsplit(' ', 1)[0]
            if word_list[-3] in states_stop_word:  # state get
                state = word_list[-3] + " " + word_list[-2]
                each = each.rsplit(' ', 2)[0]
            else:
                state = word_list[-2]
                each = each.rsplit(' ', 1)[0]
            for word in each.split():
                if word in street_stop_word:
                    city = each[each.find(word) + len(word):]  # city get
                    each = each[:each.find(word) + len(word)]
                    break;
            address_line = each
        '''
        print(address_line)
        print(city)
        print(state)
        print(zip_code)
        '''

        address_dict["AddressLine"] = address_line
        address_dict["City"] = city
        address_dict["State"] = state
        address_dict["Zip"] = zip_code
        address_dict["Country"] = country
        print(address_dict)
        '''
        etree = send_request(address_dict)
        response_dict = parse_etree(etree)
        print(response_dict)
        '''


if __name__ == "__main__":
    #read_and_post()

    address_dict = {"AddressLine": "3039 Agatha Ln", "City": "Riverside", "State": "CA", "Zip": "92507",
                    "Country": "US"}
    etree = send_request(address_dict)
    response_dict = parse_etree(etree)
    print(response_dict)

    '''
    print(response_dict["Code"])
    print(response_dict["Description"])
    print(response_dict["AddressLine"])
    print(response_dict["PoliticalDivision2"])
    print(response_dict["PoliticalDivision1"])
    print(response_dict["PostcodePrimaryLow"])
    print(response_dict["PostcodeExtendedLow"])
    print(response_dict["Region"])
    print(response_dict["CountryCode"])
    '''
'''
AddressLine
Code
CountryCode
Description
PoliticalDivision1
PoliticalDivision2
PostcodeExtendedLow
PostcodePrimaryLow
Region
'''