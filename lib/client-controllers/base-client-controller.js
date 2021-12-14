  $(document).ready(function(){
    var shoppingCart = (function() {
      cart = [];
      
      // Constructor
      function Itemdb(name, PORT , HostServer, size, descr, count) {
        this.name = name;
        this.port = port;
        this.HostServer = HostServer;
        this.size = size;
        this.descr = descr;
        this.count = count;
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
      objdb.addItemToCart = function(name,  PORT , HostServer, size, descr, count) {
        // console.log(name)
        for(var item in cart) {
          if(cart[item].name === name) {
            alert("Server/Database already exists");
            saveCart();
            return;
          }
        }
        var item = new Itemdb(name,  PORT , HostServer, size, descr, count);
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
          shoppingCart.addItemToCart(name, CPU, RAM, storage, desc, 1);
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
        shoppingCart.addItemToCart(name,  PORT , HostServer, size, descr, 1);
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
 



    $("#order-now").click(function(){
      for (i in cart){
        $.post("/addserver",       
        {
          name: cart[i].name,
          cpu: cart[i].PORT,
          ram: cart[i].HostServer,
          storage: cart[i].storage,
          description: cart[i].descr
        }
        ).done(data => {
          console.log(data);
          alert(cart[i].name + data)
          shoppingCart.removeItemFromCartAll(cart[i].name);
          // displayCart();
        })
      }
    });



    $("#orders").click(function(){
      var output = "";
      $.get("/getserver").done(data => {
        for (i in data){
          console.log(data[i]);
          output += "<tr>"
            + "<td>" + data[i].name + "</td>" 
            + "<td>" + data[i].cpu + "</td>" 
            + "<td>" + data[i].ram + "</td>"
            + "<td>" + data[i].storage + "</td>"  
            + "<td>" + data[i].description + "</td>" 
            +  "</tr>";          
        }               
        $.get("/getrds_db").done(data => {
          for (i in data){
            console.log(data[i]);
            output += "<tr>"
              + "<td>" + data[i].name + "</td>" 
              + "<td>" + data[i].hostserver + "</td>" 
              + "<td>" + data[i].port + "</td>"
              + "<td>" + data[i].size + "</td>"  
              + "<td>" + data[i].description + "</td>" 
              +  "</tr>";          
          }  
          $(".show-order").html(output); 
          $(".order-hide").hide();            
        })
        .fail( error => {
          console.log(error);
        })   
      })
      .fail( error => {
        console.log(error);
      })  
    });
  


    });