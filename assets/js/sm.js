(function($){
    
    $(document).ready(function(){
        
    /////////////////////////////////////////////////////////////////

    // Установка видимости элементов выпадающего списка
    // obj - dom объект, по которому необходимо установить видимость (city)
    function setVisible(obj){
        //значение rel
        var rel = obj.attributes.rel.value; 
        //список select районов
        var select = $("[name=district]");
        //dropdown список районов (где необходимо убирать видимость)
        var base = $(".dropdown-menu", select.parent());

        $($("li", district.parent().parent()).removeClass("selected").children()[0]).addClass("selected");
        $("[name=district]").val("");
        district.attr("title", "Округ");
        district.parent().removeClass("selected-option-check");
        $(".filter-option", district).text("Округ");
        $("li", base).attr("data-edit", "");
            
        for (var i = 0; i < count; i++){

            var visible = rel.indexOf((i + 1).toString()) >= 0;
            
            var items = $("[data-city~='" + (i+1) + "']");
            for (var a = 0; a <items.length; a++){

                var val = items[a].value;

                var itemLi = $("li[rel=" + (val/1+1) + "]", base);
                if (itemLi[0].dataset.edit != "true"){
                    itemLi.css("display", visible ? "" : "none");
                }
                
                if(visible){
                    itemLi[0].dataset.edit = true;
                    $("li[rel=" + (val/1+1) + "]", base).data("edit", true)
                }
                
            } 
        }
    }
        
    //получение кнопки
    //name - имя select
    function btn(name){
        return $("button", $("[name=" + name +"]").parent());
    }

    //убирает видимость rel 0 
    function disableRel(btnObj){
        if (typeof btnObj == "string"){
            btnObj = btn(btnObj);
        }
        $("[rel=0]", btnObj.parent()).css("display", "none");
    }

    //установка заголовка для элементов, которым необходим мультивыбор
    function setTitle(name, value){
        var obj = btn(name);
        
        
        setTimeout(function() {
            if (obj.attr("title") == "Nothing selected"){
                obj.attr("title", value);
                $(".filter-option", obj).text(value);   
                $("[name="  + name + "]").val([]);
                obj.parent().removeClass("selected-option-check"); 
            }  
            var txt = $(".filter-option", obj).text();
             
        }, 10);
   
    }

    //блокировка элемента
    function block(name, value){
        var obj= btn(name);  
        //ставим селектед на первый элемент
        $($("li", obj.parent().parent()).removeClass("selected").children()[0]).addClass("selected");
        //убираем значение selected
        var sel = $("[name=" + name + "]");
        if (sel.attr("multiple") != undefined){
            sel.val([]);
        }
        else{
            sel.val("");
        }

        obj.attr("title", value);
        //убираем галочку
        obj.parent().removeClass("selected-option-check");
        $(".filter-option", obj).text(value);
        obj.attr("disabled", "");     
    }

    //проверка на выбор жилья
    function check(txt){
        
        rooms.removeAttr("disabled");
        
        if (txt == "Тип жилья"){
            return;
        }
        
        if (txt == "Частный дом" || txt == "Комната"){
            
            block("room", "Кол-во комнат");  
        }

    };

    //установка значения по умолчанию
    function setValue(name, value){
        var obj= btn(name);  
        var li = $(".dropdown-menu li", obj.parent().parent()).removeClass("selected");
        
        for (var i = 0; i < li.length; i++){
            if ($("span", li[i]).text() == value){
                li[i].classList.add("selected");
                break;
            }
        }
        
        $("[name=" + name + "]").val(value);
        obj.attr("title", value);
        obj.parent().addClass("selected-option-check");
        $(".filter-option", obj).text(value); 
    }
    /////////////////////////////////////////////////////////////////

    var typeHouse = btn("property-type");
    var city = btn("city");
    var district = btn("district");
    //количество элементов списка Город
    var count = $("option", "[name=city]").length;

    //уберем видимость город и районов
    disableRel(city);
    disableRel(district);

    // обработчик нажатия по кнопке района
    district.on("click", function(){
        
        setTimeout(function(){
            //корректируем размер выпадающего списка
            $(".dropdown-menu", district.parent()).css("minHeight", "20px"); 
        },50)
        
    });
    
    var rooms = btn("room");
    setTitle("room", "Количество комнат");
    disableRel("room");

    //обработка нажатия по списку комнат    
    $(".dropdown-menu li", $("[name=room]").parent()).on("click", function(ev){
        setTitle("room", "Количество комнат");

    });
        
    // обработка нажатия по списку городов     
    $(".dropdown-menu li", $("[name=city]").parent()).on("click", function(ev){
        district.removeAttr("disabled");
        setVisible(ev.currentTarget);
        switch (ev.currentTarget.innerText) {
            case "Москва":
                setValue("district", "Все округа");
                $("[name=district]").val(1);
                break;
            case "Московская область":
                setValue("district", "Все районы");
                $("[name=district]").val(6);
                break;
            case "Новая Москва":
                setValue("district", "Все районы");
                $("[name=district]").val(6);
                break;
            case "Все города":
                block("district", "Округ");
                break;
                
            default:
                break;
        }

      //  check(ev.target.innerText);

    }); 
        
    //обработка нажатия по району
    $(".dropdown-menu li", $("[name=district]").parent()).on("click", function(ev){
        var rel = ev.currentTarget.attributes.rel.value;
        if (rel == 0){
            return;
        }
        
        district.attr("title", ev.currentTarget.innerText);
        $(".filter-option", district).text(ev.currentTarget.innerText);

    });
 
    //нажатие по типу дома    
    $("li", typeHouse.parent().parent()).on("click", function(ev){
        check(ev.target.innerText);

    })   
        
    //проверка
    check(typeHouse.attr("title"));
    
    //для city - Москва
    setValue("city", "Москва");
    //установка видимости выпадающего списка
    setVisible($(".dropdown-menu li.selected", $("[name=city]").parent())[0]);
    //установка для районов все округа
    setValue("district", "Все округа");

    //для selected Москва - это 2 (см value)
    $("[name=city]").val(2);
    //Все округа - это 0 (см.value)
    $("[name=district]").val(0);  
})
}($))

