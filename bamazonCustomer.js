var mysql = require('mysql');
var inquirer = require('inquirer');
var Table = require('cli-table')
//connecting js and sql
var connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    password: "adrinal drift",
    user: "root",
    database: "bamazon_db"
});
connection.connect(function (err) {
    if (err) throw err;
    console.log("connected as id: " + connection.threadId);
    console.log("Products Available for Sale");
    console.log("________________________________");
    afterconnection();
});
function afterconnection() {
    connection.query("Select * from products", function (err, res) {
        if (err) throw err;
        var table = new Table({
            head: ["ID", "Products", "Department", "Price", "Stock Quantity"]
        });
        for (var i = 0; i < res.length; i++) {
            table.push([res[i].item_id, res[i].Product_name, res[i].Department_name, res[i].Price, res[i].Stock_quantity]);
        }
        console.log(table.toString());
        // start();
        // function start() {
        inquirer.prompt([
            {
                name: "item_id",
                type: "input",
                message: "Enter the ID of the product you would like to buy: ",
                validate: function (value) {
                    if (isNaN(value) == false) {
                        return true;
                    }
                    else {
                        return false;
                    }
                }
            },
            {
                name: "Stock_quantity",
                type: "input",
                message: "How many units of the product woud you like to buy? ",
                validate: function (value) {
                    if (isNaN(value)) {
                        return false;
                    }
                    else {
                        return true;
                    }
                }
            }
        ]).then(function (input) {
            var itemtopurchase = input.item_id - 1;
            var itemselected = res[itemtopurchase];
            var itemquantity = input.Stock_quantity;
            var itemtotal = res[itemtopurchase].Price.toFixed(2) * itemquantity;

            if (res[itemtopurchase].Stock_quantity > itemquantity) {
                console.log("Your order total is $ " + itemtotal);
                connection.query("update products set ? where ?", [
                    { Stock_quantity: (res[itemtopurchase].Stock_quantity - itemquantity) },
                    { item_id: res[itemtopurchase].item_id }
                ], function (err, res) {
                    if (err) throw err; 
                });
            }
            else {
                console.log("Sorry there is not enough stock!");
            }
            //reorder();
        });
    });
}
//     function reorder() {
//         inquirer.prompt([{
//             name: "reply",
//             type: "confirm",
//             message: "Would you like to purchase another item?"
//         }]).then(function (input) {
//             if (input.reply) {
//                 afterconnection();
//             }
//             else {
//                 console.log("Enjoy your order!");
//             }
//         });
//     }
// }

