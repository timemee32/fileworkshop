var itEdit = false; //add,edit
var nextIdMenu = 0;
var editIdMenu = null;

var dataFood;
var typeFood;
$(document).ready(function () {
    // nextIdMenu = dataTblMenu.length;
    // get function dataTblMenu
    // getFood();
    // get function dataLUTMenuType
    getFoodType();


    $('#selMenu').on('change', function () {
        var selectedMenu = this.value;
        if (selectedMenu != 0) {
            const filterMenu = dataFood.filter(function (item) {
                return item.categoryId == selectedMenu //int
            })
            // deletetable old
            $('#tblShowMenu tr:not(:first-child)').remove();

            createTableMenu(filterMenu)
        } else {
            //Show all
            (selectedMenu = 0)

            $('#tblShowMenu tr:not(:first-child)').remove();

            createTableMenu(dataFood)
        }
    });

    // add Menu
    $('#btnSaveMenu').click(function () {
        var formMenu = {};
        formMenu.txtNameMenu = $('#txtNameMenu').val();
        formMenu.selInsertMenuVal = $('#selInsertMenu option:selected').val();
        formMenu.selInsertMenu = $('#selInsertMenu option:selected').text();
        formMenu.numPrice = $('#numPrice').val();
        formMenu.typeResId = dataRestaurant.restaurantId;
        formMenu.id = ++nextIdMenu;
        if (itEdit) {
            //mode edit
            updateMenu(formMenu);
        }
        //mode add
        else {
            var chkSaveData = confirm('ต้องการบันทึกข้อมูลหรือไม่');
            if (chkSaveData) {
                alert('บันทึกข้อมูลเรียบร้อย')
                //mode add
                fetch('https://gdev.geotalent.co.th/Training/api/food/create', {
                    method: 'POST',
                    body: JSON.stringify({
                        name: formMenu.txtNameMenu,
                        price: formMenu.numPrice,
                        categoryId: formMenu.selInsertMenuVal,
                        restaurantId: formMenu.typeResId
                    }), headers: {
                        'Content-type': 'application/json; charset=UTF-8'
                    }
                }).then(function () {
                    $('#tblShowMenu tr:not(:first-child)').remove();

                    getFood();

                    resetFormMenu();
                });
            }
            else {

            }
        }
        itEdit = false;
        editIdMenu = null;
    });
});

// edit table Menu
var filterTableMenu
function btnEditMenu(id) {
    itEdit = true;
    console.log("id", id)
    editIdMenu = id;

    filterTableMenu = dataFood.filter(function (item) { //เปรียบเทียบ id data - id row

        return id == item.foodId
    });

    $('#txtNameMenu').val(filterTableMenu[0].foodName);
    $('#selInsertMenu').val(filterTableMenu[0].categoryId);
    $('#numPrice').val(filterTableMenu[0].price);
    // console.log("filterTableMenu",filterTableMenu)
}

// update Menu
function updateMenu(formMenu) {
    var chkUpdate = confirm('ต้องการอัพเดทข้อมูลหรือไม่');
    if (chkUpdate) {
        alert('อัพเดทข้อมูลเรียบร้อย')
        fetch('https://gdev.geotalent.co.th/Training/api/food/update', {
                    method: 'POST',
                    body: JSON.stringify({
                        id: editIdMenu,
                        name: formMenu.txtNameMenu,
                        price: formMenu.numPrice,
                        categoryId: formMenu.selInsertMenuVal,
                        restaurantId: formMenu.typeResId
                    }), headers: {
                        'Content-type': 'application/json; charset=UTF-8'
                    }
                }).then(function () {
                    $('#tblShowMenu tr:not(:first-child)').remove();

                    getFood();
                });
        resetFormMenu();

    } else {

    }
}

// function createTable MENU
function createTableMenu(creatFood) {
    $.each(creatFood, function (key, value) {
        creatFood += '<tr>';
        creatFood += '<td>' + value.foodName + '</td>';
        creatFood += '<td>' + value.categoryName + '</td>';
        creatFood += '<td>' + value.price + '</td>';
        creatFood += '<td><button onclick = btnEditMenu(' + value.foodId + ')>Edit</button></td>';
        creatFood += '<td><button onclick = btnDeleteMenu(' + value.foodId + ')>Delete</button></td>';
        creatFood += '</tr>'

    });
    $('#tblShowMenu').append(creatFood);
}

// createSelect loop for array 
function createSelectMenu(creatFoodType) {
    $.each(creatFoodType, function (index, value) {

        creatFoodType += '<option value = ' + value.categoryId + ' >' + value.categoryName + '</option>'
    });
    $('#selMenu').append(creatFoodType);
    $('#selInsertMenu').append(creatFoodType);
}



// option id
function getMenu(id) {
    console.log("id", id)
    var filterSel = typeFood.filter(function (item) {
        // console.log(item.id ,id )

        return item.categoryId == id
    })
    console.log("filterSel", filterSel)
}
function getInsertMenu(id) {
    console.log("id", id)
    var filterSel = typeFood.filter(function (item) {

        return item.categoryId == id
    })
    console.log("filterSel", filterSel)
}

// // function view MENU
// function btnView() {
//     $(document).ready(function () {
//         $('#Menu,#btnAddMenu').slideDown();
//     });
// }

// function resetMenu
function resetFormMenu() {
    $('#txtNameMenu').val('');
    $('#selInsertMenu').val('1');
    $('#numPrice').val('');
}

// delete 
function btnDeleteMenu(foodId) {
    var chkDelete = confirm('ต้องการลบข้อมูลหรือไม่');
    if (chkDelete) {
        alert('ลบข้อมูลเรียบร้อย')

        fetch('https://gdev.geotalent.co.th/Training/api/food/delete', {
            method: 'POST',
            body: JSON.stringify({
                id: foodId

            }), headers: {
                'Content-type': 'application/json; charset=UTF-8'
            }

        }).then(function () {
            $('#tblShowMenu tr:not(:first-child)').remove();
            getFood();

        });
    }
    else {

    }
}

function getFood() {
    fetch('https://gdev.geotalent.co.th/Training/api/food/all')
        .then(function (response) {
            return response.json()
        }).then(function (creatFood) {
            createTableMenu(creatFood.result)
            dataFood = creatFood.result
        });
}

function getFoodType() {
    fetch('https://gdev.geotalent.co.th/Training/api/foodcategory/all')
        .then(function (response) {
            return response.json()
        }).then(function (creatFoodType) {
            createSelectMenu(creatFoodType.result)
            typeFood = creatFoodType.result
        });
}