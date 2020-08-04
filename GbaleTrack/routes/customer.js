var express = require("express");
var router = express.Router();
var Customer = require("../models/customer");
var middleware = require("../middlewares");

router.get("/register", middleware.isAdmin, function(req,res) {
    res.render("customer/register");
});

router.post("/register", middleware.isAdmin, function(req,res) {
    Customer.create(req.body.customer, function(err,newCustomer) {
        if(err) {
            req.flash("error", err.message);
            return res.render("customer/register")      
        }
        req.flash("success", "You successfully registered a customer");
        return res.redirect("/")
    })
});

router.get("/:id/edit", middleware.isAdmin, function(req,res) {
    Customer.findById(req.params.id, function(err, customer) {
        if(err || !customer) {
            req.flash("error", "Customer does not exist")
            return res.redirect("/");
        }
            return res.render("customer/edit", {customer})
    })
})

router.put("/:id/edit", middleware.isAdmin, function(req,res) {
    Customer.findById(req.params.id, function(err,foundCustomer) {
        if(err || !foundCustomer) {
            req.flash("error", "Customer does not exist");
        } else{
            Customer.findByIdAndUpdate(req.params.id, req.body.customer, function(err) {
                if(err) {
                    req.flash("error", err.message);
                    return res.render("customer/edit")
                }
                req.flash("success", "You successfully edited a customer's info");
                res.redirect("/")
            })
        }
    })
});

router.delete("/:id", middleware.isAdmin, function(req,res) {
    Customer.findById(req.params.id, function(err, foundCustomer) {
        if(err || !foundCustomer) {
            req.flash("error", "Customer does not exist");
            return res.redirect("/")
        }
        Customer.findByIdAndRemove(req.params.id, function(err) {
            if(err){
                req.flash("error", "Something went wrong while deleting the customer");
                return res.redirect("/")
            }
            req.flash("success", "You successfully deleted a customer");
            return res.redirect("/");
        });
    });
});

router.get("/details", middleware.isAdmin, function(req,res) {
    res.render("customer/details", {customers: Customer})
});



module.exports = router;