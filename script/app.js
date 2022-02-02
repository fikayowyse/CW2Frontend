var store = new Vue ({
    el: '#section1',
    data: {
        showProduct: true,
        sitename: 'After School Lessons',
        cart: [],
        sortBy: "subject",  
        orderBy: 'ascending',
        searchValue: '',
        Lessons: [],  
        checkout: {
            Name: '',
            Phone_No: null,
            lessonId: []

        } ,
        userInfo: [],
        currentUserId: ''
           
    },
    created: function() {
        console.log('requesting all Lessons from server')
            fetch('https://courseworktwo2.herokuapp.com/collection/Lessons/').then(
                function(response) {
                    response.json().then(
                        function(json){
                            store.Lessons = json;
                            console.log(json);
                        }
                    )
                }
            )

            console.log('requesting all Users from server')
            fetch('https://courseworktwo2.herokuapp.com/collection/Users/').then(
                function(response) {
                    response.json().then(
                        function(json){
                            store.userInfo = json;
                            console.log(json);
                        }
                    )
                }
            )
            console.log('requesting all Users from server')
            fetch('https://courseworktwo2.herokuapp.com/collection/Users/61f87042169dc2d90e149a25').then(
                function(response) {
                    response.json().then(
                        function(json){
                            store.currentUserId = json;
                            console.log(json);
                        }
                    )
                }
            )
            
    },
               
    methods: {
        addToCart: function (lesson) {
            if(lesson.spaces > 0){
               --lesson.spaces  
            }            
            console.log(this.currentUserId.Name)
            console.log(this.currentUserId._id)
            for(var i = 0; i< this.Lessons.length; i++){
                if(lesson.id == this.Lessons[i].id){
                    lesson.numberPurchased++
                    this.cart.push(lesson)
                    this.checkout.lessonId.push("id: " + lesson._id)
                    this.checkout.lessonId.push("Space(s): " + lesson.numberPurchased)
                }
            }
        },
        canAddToCart: function(lesson){
          return lesson.availableInventory > this.cartCount(lesson);
        },
        removeFromCart(lesson) {     
                this.cart.pop(lesson); 
                lesson.numberPurchased--  
                this.checkout.lessonId.pop(lesson._id)
                this.checkout.lessonId.pop(lesson.numberPurchased)
                ++lesson.spaces 
        },
        showCheckout(){
            this.showProduct = this.showProduct ? false : true;
        },
        cartCount(id){
            let count = 0;
            for (let i = 0; i < this.cart.length; i++){
                if(this.cart[i] === id){
                    count++
                }
            }
            return count;
        },        
        isNumber() {
            let num = document.getElementById("pNo")
            let lett = document.getElementById("letters")
            let submitBtn = document.querySelector(".submitBtn")
            var integers = /^[0-9]+$/
            var letters = /^[A-Za-z]+$/
            if(num.value.match(integers) && lett.value.match(letters)){                     
                if( this.checkout.Name != '' && this.checkout.Phone_No != null){
                    if(this.checkout.Name === this.currentUserId.Name){
                        fetch('https://courseworktwo2.herokuapp.com/collection/Users/' + this.currentUserId._id , {
                            method: 'PUT',
                            body: JSON.stringify(this.checkout),
                            headers: {'Content-Type': 'application/json' }
                        }).then(response => response.json())
                        .then(json => console.log(json)) 
                        alert("Order Updated successfully!")
                    }
                    else{    
                        console.log("posting")                
                        fetch('https://courseworktwo2.herokuapp.com/collection/Users', {
                            method: 'POST',
                            headers: {'Content-Type': 'application/json' },
                            body: JSON.stringify(this.checkout)
                        }).then(response => response.json())
                        .then(json => console.log(json)) 
                        alert("Order placed successfully!")             
                    }
                }
                return true;
            }
            else{
                alert('Please input only numeric characters for Phone number and letters for Name');

                return false;
            }
        },

    },
    computed: {

        cartItemCount: function(){
            return this.cart.length;
        },
        
        sorted() {
            let sortLessons = this.Lessons;      
     
            sortLessons = sortLessons.sort((a,b) => {
                    if(this.sortBy == "subject"){
                        let fa = a.subject.toLowerCase(), fb = b.subject.toLowerCase();

                        if (fa < fb ) {
                            return -1
                        }
                        if (fa > fb ) {
                            return 1
                        }
                    } 
                    else if (this.sortBy == 'location'){                        
                        let fa = a.location.toLowerCase(), fb = b.location.toLowerCase();

                        if (fa < fb ) {
                            return -1
                        }
                        if (fa > fb ) {
                            return 1
                        }
                    }
                return 0
            })
            if (this.sortBy == 'price'){                        
                sortLessons = sortLessons.sort((a,b) => {
                    return a.price - b.price
                })
            }
            if (this.sortBy == 'availability'){                        
                sortLessons = sortLessons.sort((a,b) => {
                    return a.spaces - b.spaces
                })
            }
            if (this.orderBy !=="ascending") {
                sortLessons.reverse()
            }
            if (this.searchValue != '' && this.searchValue) {
                sortLessons = sortLessons.filter((item) => {
                  return item.subject
                    .toUpperCase()
                    .includes(this.searchValue.toUpperCase())
                })
              }
            return sortLessons
        },
    }
}) 