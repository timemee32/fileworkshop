var isEdit = false; //add,edit
var nextId = dataRestaurant;
var nextId = 0;
var editId = null;
// var getDetail = null
var dataRestaurant; //ตัวแปรรับข้อมูลที่ API มาเก็บไว้
var typeRestaurant;
$(document).ready(function () {
    nextId = dataRestaurant;
    getRestarurant();

    getRestarurantType();


$('#btnTest').click(function(){
    console.log('datafood', dataFood)
})

    $('#selRestaurant').on('change', function () {
        var selected = this.value;
        if (selected != 0) {
            const filter = dataRestaurant.filter(function (item) {
                return item.restaurantTypeId == selected //int
            });
            // deletetable old
            $('#tblShow tr:not(:first-child)').remove();

            createTable(filter)
        } else {
            //Show all
            (selected = 0)

            $('#tblShow tr:not(:first-child)').remove();

            createTable(dataRestaurant)
        }
    });

    // add RESTAURANT
    $('#btnSaveData').click(function () {
        var formRestaurant = {};
        formRestaurant.txtName = $('#txtName').val();
        formRestaurant.selInsertRestaurantVal = $('#selInsertRestaurant option:selected').val();
        formRestaurant.selInsertRestaurant = $('#selInsertRestaurant option:selected').text();
        formRestaurant.txaDetail = $('#txaDetail').val();
        formRestaurant.id = ++nextId; //ลำดับ array ทั้งหมด +1 
        if (isEdit) {
            //mode edit
            updateData(formRestaurant);
        }
        //mode add
        else {
            var chkSaveData = confirm('ต้องการบันทึกข้อมูลหรือไม่');
            if (chkSaveData) {
                alert('บันทึกข้อมูลเรียบร้อย')
                //mode add
                fetch('https://gdev.geotalent.co.th/Training/api/restaurant/create', {
                    method: 'POST',
                    body: JSON.stringify({
                        name: formRestaurant.txtName,
                        detail: formRestaurant.txaDetail,
                        type: formRestaurant.selInsertRestaurantVal
                    }), headers: {
                        'Content-type': 'application/json; charset=UTF-8'
                    }
                }).then(function () {
                    $('#tblShow tr:not(:first-child)').remove();

                    getRestarurant();

                    resetForm();
                });
            }
            else {

            }
        }
        isEdit = false;
        editId = null;
    });
});

// edit table RESTAURANT
function btnEdit(id) {
    isEdit = true;
    console.log("id", id)
    editId = id;
    var filterTable
    filterTable = dataRestaurant.filter(function (item) { //เปรียบเทียบ id data - id row

        return id == item.restaurantId
    });
    console.log("filterTable", filterTable)

    $('#txtName').val(filterTable[0].restaurantName); //บอกว่า row ไหน
    $('#txaDetail').val(filterTable[0].detail);
    $('#selInsertRestaurant').val(filterTable[0].restaurantTypeId);
}

// update RESTAURANT
function updateData(formRestaurant) {
    var chkUpdate = confirm('ต้องการอัพเดทข้อมูลหรือไม่');
    if (chkUpdate) {
        alert('อัพเดทข้อมูลเรียบร้อย')
        fetch('https://gdev.geotalent.co.th/Training/api/restaurant/update', {
            method: 'POST',
            body: JSON.stringify({
                id: editId,
                name: formRestaurant.txtName,
                detail: formRestaurant.txaDetail,
                type: formRestaurant.selInsertRestaurantVal
            }), headers: {
                'Content-type': 'application/json; charset=UTF-8' //รองรับภาษา
            }
        }).then(function () {
            $('#tblShow tr:not(:first-child)').remove();
            getRestarurant();

        });
        resetForm();

    } else {

    }
}


// function  createTable RESTAURANT  ข้อมูลมาสร้างวนเเสดงข้อมูล
function createTable(createRestaurant) { //ระวังการตั้งชื่อตัวแปร global ซ้ำกับ  local
    // console.log(createRestaurant)
    $.each(createRestaurant, function (key, value) {
        createRestaurant += '<tr>';
        createRestaurant += '<td>' + value.restaurantName + '</td>';
        createRestaurant += '<td>' + value.restaurantTypeName + '</td>';
        createRestaurant += '<td><button onclick = btnView(' + value.restaurantId + ')>View Menu</button></td>';
        createRestaurant += '<td><button onclick = btnEdit(' + value.restaurantId + ')>Edit</button></td>';
        createRestaurant += '<td><button onclick = btnDelete(' + value.restaurantId + ')>Delete</button></td>';
        createRestaurant += '</tr>'

    });
    $('#tblShow').append(createRestaurant);
}

function btnView(restaurantId) {
    var filterData
    filterData = dataRestaurant.filter(function (item) { //เปรียบเทียบ id data - id row

        return restaurantId == item.restaurantId
    });
    console.log("filterData", filterData)
    fetch('https://gdev.geotalent.co.th/Training/api/food/all')
        .then(function (response) {
            console.log(response)
            return response.json() // ส่งข้อมูลกลับมาให้เป็น json
        }).then(function (creatFood) { 
            $('#tblShowMenu tr:not(:first-child)').remove();
            createTableMenu(creatFood.result) 
            dataFood = creatFood.result 
        });
        
}

// createSelect loop for array 
function createSelect(createRestaurantType) {
    $.each(createRestaurantType, function (index, value) {
        createRestaurantType += '<option value = ' + value.id + ' >' + value.name + '</option>'
    });
    $('#selRestaurant').append(createRestaurantType);
    $('#selInsertRestaurant').append(createRestaurantType);
}

// option id
function getType(id) {
    // console.log("id", id)
    var filterSel = typeRestaurant.filter(function (item) {
        // console.log(item.id, id)

        return item.id == id
    })
    console.log("filterSel", filterSel)
}

function getInsertType(id) {
    console.log("id", id)
    var filterSel = typeRestaurant.filter(function (item) {

        return item.id == id
    })
    console.log("filterSel", filterSel)
}

// function delete 
function btnDelete(restaurantId) {
    var chkDelete = confirm('ต้องการลบข้อมูลหรือไม่');
    if (chkDelete) {
        alert('ลบข้อมูลเรียบร้อย')

        fetch('https://gdev.geotalent.co.th/Training/api/restaurant/delete', {
            method: 'POST',
            body: JSON.stringify({
                id: restaurantId

            }), headers: {
                'Content-type': 'application/json; charset=UTF-8'
            }

        }).then(function () {
            $('#tblShow tr:not(:first-child)').remove();
            getRestarurant();

        });
    }
    else {

    }

}
// function reset
function resetForm() {
    $('#txtName').val('');
    $('#selInsertRestaurant').val('2');
    $('#txaDetail').val('');
}


// function getRestarurant
function getRestarurant() {
    fetch('https://gdev.geotalent.co.th/Training/api/restaurant/all')
        .then(function (response) {
            return response.json() // ส่งข้อมูลกลับมาให้เป็น json
        }).then(function (createRestaurant) { //function เอาข้อมูลมาวนสร้าง table
            createTable(createRestaurant.result) //.result  ตัวแปร array
            dataRestaurant = createRestaurant.result // ตัวแปรรับ alldata
        });

}

// function getRestarurant Type
function getRestarurantType() {
    fetch('https://gdev.geotalent.co.th/Training/api/restauranttype/all')
        .then(function (response) {
            return response.json() // ส่งข้อมูลกลับมาให้เป็น json
        }).then(function (createRestaurantType) { //function เอาข้อมูลมาวนสร้าง option
            createSelect(createRestaurantType.result) //.result  ตัวแปร array เเละทำการสร้างตารางจาก function
            typeRestaurant = createRestaurantType.result

        });

}

 //test
//  fetch('https://gdev.geotalent.co.th/Training/api/restaurant/update', {
//     method: 'POST',
//     body: JSON.stringify({
//         id: 2366,
//         name: "AMNAD",
//         detail: "KOETPON",
//         type: 5
//     }), headers: {
//         'Content-type': 'application/json; charset=UTF-8' //รองรับภาษา
//     }
// }).then(function (response) {
//     console.log('response', response)
//     return response.json();
// });

// function addData() {
// // let test = JSON.stringify({
// //     name: 'time',
// //     detail: 'mee',
// //     type: 3
// // })

// // console.log("test",test)

//     fetch('https://gdev.geotalent.co.th/Training/api/restaurant/create', {
//         method: 'POST',
//         body: JSON.stringify({
//             name: 'GOooo',
//             detail: 'aaa',
//             type: 3
//         }),	headers: {
//             'Content-type': 'application/json; charset=UTF-8'
//         }
//     }).then(function (response) {
//         console.log('response', response)
//         return response.json();


//     });
// }

