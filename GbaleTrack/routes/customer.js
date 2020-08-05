var express = require("express");
var router = express.Router();
var Customer = require("../models/customer");
var middleware = require("../middlewares");

router.get("/register", middleware.isAdmin, function(req,res) {
    res.render("customer/register", {page: "customer"});
});

router.post("/register", middleware.isAdmin, function(req,res) {
    Customer.create(req.body.customer, function(err,newCustomer) {
        if(err) {
            req.flash("error", err.message);
            return res.redirect("/customer/register")       
        }
        req.flash("success", "You successfully registered a customer");
        return res.redirect("/customer/details");
    })
});

router.put("/:id/counter", middleware.isAdmin, function(req,res) {
    Customer.findById(req.params.id, function(err, foundCustomer) {
        if(err || !foundCustomer) {
            req.flash("error", "Customer does not exist");
            return res.redirect("/home")
        }
        var count = foundCustomer.counter + 1;
        Customer.findByIdAndUpdate(req.params.id, {counter: count}, function (err) {
            if(err) {
                req.flash("error", err.message);
                return res.redirect("/customer/details");
            }
            req.flash("success", "You successfully moved a customer");
            res.redirect("/customer/details");
        })
    })
})


router.get("/:id/edit", middleware.isAdmin, function(req,res) {
    Customer.findById(req.params.id, function(err, customer) {
        if(err || !customer) {
            req.flash("error", "Customer does not exist")
            return res.redirect("/home");
        }
            return res.render("customer/edit", {customer:customer})
    })
})

router.put("/:id/edit", middleware.isAdmin, function(req,res) {
    Customer.findById(req.params.id, async function(err,foundCustomer) {
        if(err || !foundCustomer) {
            req.flash("error", "Customer does not exist");
            res.redirect("/home")
        } else{
            Customer.findByIdAndUpdate(req.params.id, req.body.customer, function(err) {
                if(err) {
                    req.flash("error", err.message);
                    return res.render("customer/edit")
                }
                req.flash("success", "You successfully edited a customer's info");
                res.redirect("/customer/details")
            })            
        }
    })
});

router.get("/details", middleware.isAdmin, function(req,res) {
    Customer.find({}, function(err, foundCustomers) {
        if(err || !foundCustomers) {
            req.flash("error", "NO customer was found");
            return res.redirect("/home");
        }
        res.render("customer/details", {customers: foundCustomers, page: "details"})
    })
});

router.delete("/:id/delete", middleware.isAdmin, function(req,res) {
    Customer.findById(req.params.id, function(err, foundCustomer) {
        if(err || !foundCustomer) {
            req.flash("error", "Customer does not exist");
            return res.redirect("/home")
        }
        Customer.findByIdAndRemove(req.params.id, function(err) {
            if(err){
                req.flash("error", "Something went wrong while deleting the customer");
                return res.redirect("/customer/details")
            }
                req.flash("success", "You successfully deleted a customer");
                return res.redirect("/customer/details");
        });
    });
});

router.get("/payment", middleware.isAdmin,function(req,res) {
    Customer.find({}, function(err, foundCustomers) {
        if(err || !foundCustomers)  {
            req.flash("error", "Customers not found");
            return res.redirect("/home");
        }
        res.render("customer/payment", {customers: foundCustomers, page: "payment"});
    })
});

router.post("/:id/payment", middleware.isAdmin, function(req,res) {
    Customer.findByIdAndUpdate(req.params.id, {paid:true}, function(err) {
        if(err) {
            req.flash("error", "SOmething went wrong whilw updating the payment status");
            return res.redirect("/customer/payment");
        }
        req.flash("success", "You successfully confirmed that a customer has paid");
        return res.redirect("/customer/payment");
    })
})

module.exports = router;