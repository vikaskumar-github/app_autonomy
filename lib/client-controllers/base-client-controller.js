  $(document).ready(function(){
    var shoppingCart = (function() {
      cart = [];
      
      // Constructor
      function Itemdb(name, PORT , HostServer, size, descr, count, objecttype) {
        this.name = name;
        this.port = port;
        this.HostServer = HostServer;
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
      objdb.addItemToCart = function(name,  PORT , HostServer, size, descr, count, objecttype) {
        // console.log(name)
        for(var item in cart) {
          if(cart[item].name === name) {
            alert("Server/Database already exists");
            saveCart();
            return;
          }
        }
        var item = new Itemdb(name,  PORT , HostServer, size, descr, count, objecttype);
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
      $("#cpu").val("");
      $("#ram").val("");
      $("#storage").val("");
      $("#desc").val("");
    }    
    function clearFieldsDB(){
      $("#getdb").val("");
      $("#port").val("");
      $("#hostServer").val("");
      $("#size").val("");
      $("#descr").val("");
    }
    // Add item
    $('.add-to-cart').click(function(event) {
      event.preventDefault();
      console.log($(event.target).attr('id'));
      if($(event.target).attr('id')=='serverbtn'){
          var name = $("#getserver").val();
          var CPU = $("#cpu").val();
          var RAM = $("#ram").val();
          var storage = $("#storage").val();
          var desc = $("#desc").val();
          shoppingCart.addItemToCart(name, CPU, RAM, storage, desc, 1, 'server');
          displayCart();
          clearFieldsServer();
      }
      else if($(event.target).attr('id')=='dbbtn'){
        console.log("in")
        var name = $("#getdb").val();
        var PORT = $("#port").val();
        var HostServer = $("#hostServer").val();
        var size = $("#size").val();
        var descr = $("#descr").val();
        console.log(name,PORT,HostServer,size,descr);
        shoppingCart.addItemToCart(name,  PORT , HostServer, size, descr, 1, 'database');
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
      var output = "";
      for(var i in cartArray) {
        console.log(cartArray[i]);
        output += "<tr>"
          + "<td>" + cartArray[i].name + "</td>" 
          + "<td>" + cartArray[i].PORT + "</td>" 
          + "<td>" + cartArray[i].HostServer + "</td>"
          + "<td>" + cartArray[i].size + "</td>"  
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
 



    // $("#order-now").click(function(){
    //   for (i in cart){
    //     console.log(cart[i]);
    //     $.post("/addrds_db",       
    //     {
    //       name: cart[i].name,
    //       hostserver: cart[i].HostServer,
    //       port: cart[i].PORT,
    //       size: cart[i].storage,
    //       description: cart[i].descr
    //     }
    //     ).done(data => {
    //       console.log(data);
    //       alert(cart[i].name + data)
    //       // shoppingCart.removeItemFromCartAll(cart[i].name);
    //       // displayCart();
    //     })
    //   }
    // });



    $("#order-now").click(function(){
      for (i in cart){
        console.log(cart[i]);
        if(cart[i].objecttype === 'database'){
          $.post("/addorders",       
          {
            name: cart[i].name,
            hostserver: cart[i].HostServer,
            port: cart[i].PORT,
            size: cart[i].size,
            description: cart[i].descr,
            objecttype: cart[i].objecttype
          }
          ).done(data => {
            console.log(data);
            alert(cart[i].name + data)
            shoppingCart.removeItemFromCartAll(cart[i].name);
            displayCart();
          })
        }else if(cart[i].objecttype === 'server'){
          $.post("/addorders",       
          {
            name: cart[i].name,
            ram: cart[i].HostServer,
            cpu: cart[i].PORT,
            size: cart[i].size,
            description: cart[i].descr,
            objecttype: cart[i].objecttype
          }
          ).done(data => {
            console.log(data);
            alert(cart[i].name + data)
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
        + "<th class='th1'>" + "CPU / PORT" + "</th>"
        + "<th class='th1'>" + "RAM / Hosting server" + "</th>"
        + "<th class='th1'>" + "size" + "</th>"
        + "<th class='th1'>" + "Description" + "</th>"
        + "</thead>"
      $.get("/getorders").done(data => {
        for (i in data){
          if(data[i].objecttype === 'server'){
            console.log(data[i]);
            output += "<tr>"
              + "<td>" + data[i].name + "</td>" 
              + "<td>" + data[i].cpu + " vCore" + "</td>" 
              + "<td>" + data[i].ram + " GB"+ "</td>"
              + "<td>" + data[i].size + " GB" + "</td>"  
              + "<td>" + data[i].description + "</td>" 
              +  "</tr>";          
          }            
          }
        // $(".show-order").html(output); 
        $(".order-hide").hide();                
      })
      .fail( error => {
        console.log(error);
      })
      // For displaying database
      $.get("/getorders").done(data => {
        for (i in data){
          if(data[i].objecttype === 'database'){
            console.log(data[i]);
            output += "<tr>"
              + "<td>" + data[i].name + "</td>" 
              + "<td>" + data[i].port + "</td>" 
              + "<td>" + data[i].hostserver + "</td>"
              + "<td>" + data[i].size + " GB" + "</td>"  
              + "<td>" + data[i].description + "</td>" 
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