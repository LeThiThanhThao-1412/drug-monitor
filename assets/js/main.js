let url = location.host;//so it works locally and online

$("table").rtResponsiveTables();//for the responsive tables plugin

$("#add_drug").submit(function(event){//on a submit event on the element with id add_drug
    /*alert($("#name").val() + " sent successfully!");//alert this in the browser*/
    event.preventDefault();
    
    var formData = $(this).serialize();
    
    $.ajax({
        url: `/api/drugs`,
        method: "POST",
        data: formData,
        success: function(response) {
            alert($("#name").val() + " added successfully!");
            window.location.href = "/manage";
        },
        error: function(xhr) {
            const errorResponse = JSON.parse(xhr.responseText);
            alert("Validation errors:\n" + errorResponse.errors.join("\n"));
        }
    });
})



$("#update_drug").submit(function(event){// on clicking submit
    event.preventDefault();//prevent default submit behaviour

    //var unindexed_array = $("#update_drug");
    var unindexed_array = $(this).serializeArray();//grab data from form
    var data = {}

    $.map(unindexed_array, function(n, i){//assign keys and values from form data
        data[n['name']] = n['value']
    })


    // Sửa URL để sử dụng http thay vì https cho localhost
    var protocol = window.location.protocol;
    var request = { // use a put API request to use data from above to replace what's on database
        "url": `${protocol}//${url}/api/drugs/${data.id}`,
        "method": "PUT",
        "data": data
    }

    $.ajax(request)
        .done(function(response) {
            alert(data.name + " Updated Successfully!");
            window.location.href = "/manage"; // Chuyển hướng về trang quản lý
        })
        .fail(function(error) {
            const errorResponse = JSON.parse(xhr.responseText);
            alert("Validation errors:\n" + errorResponse.errors.join("\n"));
        });

})

if(window.location.pathname == "/manage"){//since items are listed on manage
    $ondelete = $("table tbody td a.delete"); //select the anchor with class delete
    $ondelete.click(function(){//add click event listener
        let id = $(this).attr("data-id") // pick the value from the data-id

        // Sửa URL để sử dụng http thay vì https cho localhost
        var protocol = window.location.protocol;
        let request = { // save API request in variable
            "url": `${protocol}//${url}/api/drugs/${id}`,
            "method": "DELETE"
        }

        if(confirm("Do you really want to delete this drug?")){// bring out confirm box
            $.ajax(request).done(function(response){// if confirmed, send API request
                alert("Drug deleted Successfully!");//show an alert that it's done
                location.reload();//reload the page
            })
        }

    })
}

if(window.location.pathname == "/purchase"){
//$("#purchase_table").hide();

$("#drug_days").submit(function(event){//on a submit event on the element with id add_drug
    event.preventDefault();//prevent default submit behaviour
    $("#purchase_table").show();
    days = +$("#days").val();
    alert("Drugs for " + days + " days!");//alert this in the browser
})

}
// File: public/js/main.js
if (window.location.pathname == "/purchase") {
    // Ẩn bảng kết quả ban đầu
    $("#purchase_table").hide();
    
    // Biến toàn cục để lưu trữ dữ liệu drugs
    let drugsData = [];
    
    // Lấy dữ liệu drugs từ server khi trang tải
    $.get("/api/drugs")
        .done(function(data) {
            drugsData = data;
            // Tự động tính toán với giá trị mặc định
            calculatePurchase(30);
        })
        .fail(function(error) {
            console.error("Error fetching drugs data:", error);
        });
    
    // Xử lý sự kiện submit form
    $("#drug_days").submit(function(event) {
        event.preventDefault();
        const days = parseInt($("#days").val());
        
        if (isNaN(days) || days <= 0) {
            alert("Please enter a valid number of days");
            return;
        }
        
        calculatePurchase(days);
    });
    
    // Hàm tính toán và hiển thị kết quả
    function calculatePurchase(days) {
        if (drugsData.length === 0) {
            alert("No drug data available");
            return;
        }
        
        // Xóa nội dung cũ
        $("#purchase_table_body").empty();
        
        // Tính toán và thêm dữ liệu mới
        drugsData.forEach((drug, index) => {
            const pillsNeeded = days * drug.perDay;
            const cardsToBuy = Math.ceil(pillsNeeded / drug.card);
            const packsToBuy = Math.ceil(pillsNeeded / drug.pack);
            const cardsPerPack = (drug.pack / drug.card).toFixed(6);
            
            const row = `
                <tr>
                    <td>${index + 1}</td>
                    <td>${drug.name}</td>
                    <td>${drug.perDay}</td>
                    <td>${pillsNeeded}</td>
                    <td>${cardsToBuy} (${cardsPerPack} cards per pack)</td>
                    <td>${packsToBuy}</td>
                </tr>
            `;
            
            $("#purchase_table_body").append(row);
        });
        
        // Hiển thị bảng
        $("#purchase_table").show();
        
        // Hiển thị kết quả tổng
        $("#purchase_results").html(`
            <div class="result-summary">
                <h3>Purchase Summary for ${days} days</h3>
                <p>Calculation completed. See table below for details.</p>
            </div>
        `);
    }
}