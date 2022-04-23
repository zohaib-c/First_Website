$(function(){
    
    var tableData; // defining a global variable to store table data from the server; the scope is global because the variable is used by multiple functions
    
    
    // getting data from the server
    function getData(){
        $.ajax({
            url: "https://wt.ops.labs.vu.nl/api22/54d04b2a",
            method: "GET",
            dataType: "json",
            async: false, //this was done to allow the data to be fully received and stored in tableData before moving on to the other js code
            success: function(data){
                tableData = data;
            }
        })
    }
    
    // function to fill in the table with the data from server
    function fillTable(){
        var table = document.getElementById("tableBody");
            table.innerHTML = '';
            for (let data of tableData) {
                let row = table.insertRow(-1);
                
                let brand = row.insertCell(0);
                brand.innerHTML = data.brand;

                let model = row.insertCell(1);
                model.innerHTML = data.model;

                let os = row.insertCell(2);
                os.innerHTML = data.os;

                let screensize = row.insertCell(3);
                screensize.innerHTML = data.screensize;
                
                let image = row.insertCell(4);
                var picture = String(data.image);
                image.innerHTML = "<figure> <img src=" + picture + "> </figure>";
            }
    }
    
    var caretUpClassName = 'fa fa-caret-up';
    var caretDownClassName = 'fa fa-caret-down';
    
    // a standard sort function taken from stackoverflow 
    const sort_by = (field, reverse, primer) => {
      const key = primer ?
        function(x) {
          return primer(x[field]);
        } :
        function(x) {
          return x[field];
        };

      reverse = !reverse ? 1 : -1;

      return function(a, b) {
        return a = key(a), b = key(b), reverse * ((a > b) - (b > a));
      };
    };
    
    function clearArrow() {
      let carets = document.getElementsByClassName('caret');
      for (let caret of carets) {
        caret.className = "caret";
      }
    }
    
    function toggleArrow(event) {
        let element = event.target;
        let caret, field, reverse;
        if (element.tagName === 'SPAN') {
            caret = element.getElementsByClassName('caret')[0];
            field = element.id;
        }
        else {
            caret = element;
            field = element.parentElement.id;
        }

        let iconClassName = caret.className;
        clearArrow();
        if (iconClassName.includes(caretUpClassName)) {
            caret.className = `caret ${caretDownClassName}`;
            reverse = false;
        } else {
            reverse = true;
            caret.className = `caret ${caretUpClassName}`;
        }

        tableData.sort(sort_by(field, reverse));
        fillTable();
    }
     
    getData();
    fillTable();// initially calling fillTable to insert data into empty table

    let tableColumns = document.getElementsByClassName('table-column');

    for (let column of tableColumns) {
      column.addEventListener('click', function(event) {
        toggleArrow(event);
      });
    };
    
    // click event for submit button leading to a new table being loaded
    $("#submitBtn").click(function(event){
        event.preventDefault();
        
        let myForm = document.getElementById("newEntry");
        let formData = new FormData(myForm);
        
        var jsonData ={};
        formData.forEach(function(value, key){
            jsonData[key] = value;
        });
        console.log(jsonData);
        $.ajax({
            url: "https://wt.ops.labs.vu.nl/api22/54d04b2a",
            method: "POST",
            data: jsonData,
            dataType: "json",
            success:function(){
                alert("New Entry Added");
                getData();
                fillTable();
            }
        });
    });
    
    //click event for reset button leading to reset of server data and new table being loaded
    $("#resetBtn").click(function(event){
        event.preventDefault();
        $.ajax({
            url: "https://wt.ops.labs.vu.nl/api22/54d04b2a/reset",
            method: "GET",
            success: function(){
                alert("Table Reset");
                getData();
                fillTable();
            }
        })
    }); 
    
});



/* links to code used:
 @https://betterprogramming.pub/sort-and-filter-dynamic-data-in-table-with-javascript-e7a1d2025e3c
*/