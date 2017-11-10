//locationの番号を基にした場所の名前
var LOCATION_ID = {
    "0": "Sapporo-shi",
    "1": {
        "0": "Sendai-shi",
        "1": {
            "0": {
                "0": "Maebashi-shi"
            },
            "1": {
                "0": "Utsunomiya-shi"
            },
            "2": {
                "0": "Saitama"
            },
            "3": {
                "0": "Tokyo"
            },
            "4": {
                "0": "Yokohama-shi"
            },
            "5": {
                "0": "Chiba-shi"
            },
            "6": {
                "0": "Mito-shi"
            }
        },
        "2": "Toyama-shi",
        "3": {
            "0": {
                "0": "Inazawa",
                "1": "Nagoya-shi",
                "2": "Tokoname",
                "3": "Okazaki",
                "4": "Toyohashi"
            },
            "1": {
                "0": "Gifu-shi"
            },
            "2": "Tsu-shi",
            "3": "Shizuoka-shi"
        },
        "4": "Osaka",
        "5": "Hiroshima-shi"
    },
    "2": {
        "0": {
            "0": {
                "0": "Takamatsu-shi"
            }
        },
        "1": {
            "0": {
                "0": "Tokushima-shi"
            }
        },
        "2": {
            "0": {
                "0": "Matsuyama-shi"
            }
        },
        "3": {
            "0": {
                "0": "Kochi-shi"
            }
        }
    },
    "3": "Kumamoto-shi"
};

function TEST_chon() {
    Logger.log(GetLocationJapaneseName(locationId));
}

//locationIdに数字を入力(データベースのGetValueを使用推奨)
function GetLocationName(locationId) {
    var location_string = String(locationId);
    var locationSheet = SpreadsheetApp.openById(SPREAD_SHEET_ID).getSheets()[2];
    var cells = locationSheet.getRange(1, 1, locationSheet.getLastRow(), locationSheet.getLastColumn()).getValues();
    for (var i = 0; i < cells.length; i++) {
        if (cells[i][0] == location_string) {
            return cells[i][1];
            break;
        }
    }
    /*var numlist = [];
    for (var i = 0; i < String(locationId).length; i++) {
        numlist.push(String(locationId).charAt(i));
    }

    var locationName = "";

    switch (numlist.length) {
        case 1:
            locationName = LOCATION_ID[numlist[0]];
            break;
        case 2:
            locationName = LOCATION_ID[numlist[0]][numlist[1]];
            break;
        case 3:
            locationName = LOCATION_ID[numlist[0]][numlist[1]][numlist[2]];
            break;
        case 4:
            locationName = LOCATION_ID[numlist[0]][numlist[1]][numlist[2]][numlist[3]];
            break;
        default:
            locationName = "null";
            break;
    }*/

    //return locationName;
}

function GetLocationJapaneseName(locationId) {
    var location_string = String(locationId);
    var locationSheet = SpreadsheetApp.openById(SPREAD_SHEET_ID).getSheets()[2];
    var cells = locationSheet.getRange(1, 1, locationSheet.getLastRow(), locationSheet.getLastColumn()).getValues();
    for (var i = 0; i < cells.length; i++) {
        if (cells[i][0] == location_string) {
            return cells[i][2];
            break;
        }
    }
}
