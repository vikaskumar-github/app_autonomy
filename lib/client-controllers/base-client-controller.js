  $(document).ready(function(){
    var shoppingCart = (function() {
      cart = [];
      
      // Constructor
      function Itemdb(name, port , mpass, size, descr, count, objecttype) {
        this.name = name;
        this.port = port;
        this.mpass = mpass;
        this.size = size;
        this.descr = descr;
        this.count = count;
        this.objecttype = objecttype
      }
      
      // Save cart
      function saveCart() {
        sessionStorage.setItem('shoppingCart', JSON.stringify(cart));
      }
      
        // Load cart
      function loadCart() {
        cart = JSON.parse(sessionStorage.getItem('shoppingCart'));
      }
      if (sessionStorage.getItem("shoppingCart") != null) {
        loadCart();
      }
      
      var objdb = {};
      
      // Add to cart
      objdb.addItemToCart = function(name,  port , mpass, size, descr, count, objecttype) {
        // console.log(name)
        for(var item in cart) {
          if(cart[item].name === name) {
            alert("Server/Database already exists");
            saveCart();
            return;
          }
        }
        var item = new Itemdb(name,  port , mpass, size, descr, count, objecttype);
        cart.push(item);
        saveCart();
      }
      
      // Remove item from cart
      objdb.removeItemFromCart = function(name) {
          for(var item in cart) {
            if(cart[item].name === name) {
              cart[item].count --;
              if(cart[item].count === 0) {
                cart.splice(item, count);
              }
              break;
            }
        }
        saveCart();
      }
    
      // Remove all items from cart
      objdb.removeItemFromCartAll = function(name) {
        for(var item in cart) {
          if(cart[item].name === name) {
            cart.splice(item, 1);
            break;
          }
        }
        saveCart();
      }
    
      // Clear cart
      objdb.clearCart = function() {
        cart = [];
        saveCart();
      }
    
      // Count cart 
      objdb.totalCount = function() {
        var totalCount = 0;
        for(var item in cart) {
          totalCount += cart[item].count;
        }
        // console.log(totalCount);
        return totalCount;
      }
    
    
      // List cart
      objdb.listCart = function() {
        var cartCopy = [];
        for(i in cart) {
          item = cart[i];
          itemCopy = {};
          for(p in item) {
            itemCopy[p] = item[p];
    
          }
          // itemCopy.total = Number(item.price * item.count).toFixed(2);
          cartCopy.push(itemCopy)
        }
        return cartCopy;
      }
    
      // cart : Array
      // Item : Object/Class
      // addItemToCart : Function
      // removeItemFromCart : Function
      // removeItemFromCartAll : Function
      // clearCart : Function
      // countCart : Function
      // totalCart : Function
      // listCart : Function
      // saveCart : Function
      // loadCart : Function
      return objdb;
    })();
    

    function clearFieldsServer(){
      $("#getserver").val("");
      $("#inst_nm").val("t2.micro");
      $("#kfile").val("");
      $("#storage").val("");
      $("#desc").val("");
    }    
    function clearFieldsDB(){
      $("#getdb").val("");
      $("#port").val("5432");
      $("#mpass").val("");
      $("#size").val("20");
      $("#descr").val("");
    }
    // Add item
    $('.add-to-cart').click(function(event) {
      event.preventDefault();
      // console.log($(event.target).attr('id'));
      if($(event.target).attr('id')=='serverbtn'){
          var name = $("#getserver").val();
          var inst_nm = $("#inst_nm").val();
          var kfile = $("#kfile").val();
          var storage = $("#storage").val();
          var desc = $("#desc").val();
          if(name==''||inst_nm==''||kfile==''||storage==''){
            alert("Please fill all the required fields")
            return;
          }
          shoppingCart.addItemToCart(name, inst_nm, kfile, storage, desc, 1, 'server');
          displayCart();
          clearFieldsServer();
      }
      else if($(event.target).attr('id')=='dbbtn'){
        var name = $("#getdb").val();
        var port = $("#port").val();
        var mpass = $("#mpass").val();
        var size = $("#size").val();
        var descr = $("#descr").val();
        if(name==''||port==''||mpass==''||size==''){
          alert("Please fill all the required fields")
          return;
        }
        // console.log(name,port,mpass,size,descr);
        shoppingCart.addItemToCart(name,  port , mpass, size, descr, 1, 'database');
        displayCart();
        clearFieldsDB();
      }
    });
    
    // Clear items
    $('.clear-cart').click(function() {
      shoppingCart.clearCart();
      displayCart();
    });
    
    
    function displayCart() {
      var cartArray = shoppingCart.listCart();
      var output = ""

        + "<thead>"
        + "<th class='th1'>" + "Name" + "</th>"
        + "<th class='th1'>" + "Instance Type / Port" + "</th>"
        + "<th class='th1'>" + "Key File / Password" + "</th>"
        + "<th class='th1'>" + "Size" + "</th>"
        + "<th class='th1'>" + "Description" + "</th>"
        + "</thead>"
      for(var i in cartArray) {
        output += "<tr>"
          + "<td>" + cartArray[i].name + "</td>" 
          + "<td>" + cartArray[i].port + "</td>" 
          + "<td>" + cartArray[i].mpass +  "</td>"
          + "<td>" + cartArray[i].size +  " GB"+ "</td>"  
          + "<td>" + cartArray[i].descr + "</td>" 
          + "<td><button class='delete-item btn btn-danger' data-name=" + cartArray[i].name + ">Remove</button></td>"
          +  "</tr>";
      }
      $('.show-cart').html(output);
      $('.total-count').html(shoppingCart.totalCount());
     
    }
    
    // Delete item button
    
    $('.show-cart').on("click", ".delete-item", function(event) {
        var name =$(this).data('name');
        shoppingCart.removeItemFromCartAll(name);
        displayCart();
    })
    
    // Item count input
    $('.show-cart').on("change", ".item-count", function(event) {
      var name =$(this).data('name');
      var count = Number($(this).val());
      shoppingCart.setCountForItem(name, count);
      displayCart();
    });
    
    displayCart();
 


    
    $("#order-now").click(function(){
      for (i in cart){
        if(cart[i].objecttype === 'database'){
          $.post("/addorders",       
          {
            name: cart[i].name,
            mpass: cart[i].mpass,
            port: cart[i].port,
            size: cart[i].size,
            description: cart[i].descr,
            objecttype: cart[i].objecttype
          }
          ).done(data => {
            alert(cart[i].name +" "+ data)
            shoppingCart.removeItemFromCartAll(cart[i].name);
            displayCart();
          })
        }else if(cart[i].objecttype === 'server'){
          $.post("/addorders",       
          {
            name: cart[i].name,
            inst_nm: cart[i].port,
            kfile: cart[i].mpass,
            size: cart[i].size,
            description: cart[i].descr,
            objecttype: cart[i].objecttype
          }
          ).done(data => {
            alert(cart[i].name + " "+ data)
            shoppingCart.removeItemFromCartAll(cart[i].name);
            displayCart();
          })
        }
        else{
          console.log("objecttype is not equal to database and server ")
        }

      }
    });

    
    
    $("#orders").click(function(){
      // For displaying servers
      var output = ""
        + "<thead>"
        + "<th class='th1'>" + "Name" + "</th>"
        + "<th class='th1'>" + "Instance Type / Port" + "</th>"
        + "<th class='th1'>" + "Key File / Password" + "</th>"
        + "<th class='th1'>" + "Size" + "</th>"
        + "<th class='th1'>" + "Description" + "</th>"
        + "<th class='th1'>" + "Status" + "</th>"
        + "</thead>"
      $.get("/getorders").done(data => {
        for (i in data){
          if(data[i].objecttype === 'server'){
            console.log(data[i]);
            output += "<tr>"
              + "<td>" + data[i].name + "</td>" 
              + "<td>" + data[i].inst_nm +"</td>" 
              + "<td>" + data[i].kfile +  "</td>"
              + "<td>" + data[i].size + " GB" + "</td>"  
              + "<td>" + data[i].description + "</td>" 
              + "<td>" + data[i].status + "</td>"
              +  "</tr>";          
          }
          if(data[i].objecttype === 'database'){
            console.log(data[i]);
            output += "<tr>"
              + "<td>" + data[i].name + "</td>" 
              + "<td>" + data[i].port + "</td>" 
              + "<td>" + "*******" + "</td>"
              + "<td>" + data[i].size + " GB" + "</td>"  
              + "<td>" + data[i].description + "</td>"
              + "<td>" + data[i].status + "</td>" 
              +  "</tr>";          
          }                      
          }
        $(".show-order").html(output); 
        $(".order-hide").hide();                
      })
      .fail( error => {
        console.log(error);
      })   
    });


    });