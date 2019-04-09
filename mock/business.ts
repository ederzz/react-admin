import Mock from 'mockjs'

function createBussinessList() {
    return Mock.mock({
        "bussinesses|8-20": [
            {
                "name|1": [
                    "StarBucks Coffee",
                    "Krispy Kreme"
                ],
                "img": "",
                "label|2-4": [ // TODO: mock
                    "Coffee",
                    "Tea",
                    "Seafood",
                    "Donuts",
                    "Landscaping",
                    "Contractors"
                ],
                "status|1": [
                    0,
                    1
                ],
                "updateTime": Mock.Random.date('yyyy-MM-dd'), // TODO:
                "reviews|100-500": 1,
                "stars|1": [
                    0.5,
                    1,
                    1.5,
                    2,
                    2.5,
                    3,
                    3.5,
                    4,
                    4.5,
                    5
                ],
                "views|5000-200000": 1,
                "actions|100-700": 1,
                "viewsPercent|0.2": 1,
                "actionsPercent|0.2": 1
            }

        ]
    })
}

export default {
    'GET /bussiness/list': createBussinessList()
}
