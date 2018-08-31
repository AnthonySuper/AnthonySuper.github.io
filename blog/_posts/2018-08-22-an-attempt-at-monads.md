---
title: "An Attempt at Explaining Monads"
layout: post
categories: ["programming", "haskell", "tutorials"]
---

It's an old cliche that every new Haskeller writes their own monad tutorial, generally without understanding monads very well, and generally with disastrous results.
While this is starting to be superseded by Lens tutorials, I sometimes like to pretend to be a traditionalist.
To that end, allow me to explain the scariest of typeclasses, to the best of my meager abilities.

<!--more-->

## Part 1: Doing stuff in a Context

Let's say that I'm working in Ruby on a fairly standard Rails app.
Rails models database rows as an object, with relations.
So, just to have an example, let's say that I have an `Order` model, which represents, well, an order for some product.
Each order may or may not have one `Shipment` associated with it&mdash;if the order has a `Shipment`, then the product has been shipped out to the user.
Each `Shipment` may additionally have an associated `ShipmentAudit`, if the company using our app happened to perform an audit of that particular shipment for quality control purposes.

Let's say that we're building an administrative dashboard, where an analyst can view all the orders placed, along with a brief amount of information on them.
If there was a `ShipmentAudit` for a particular order, we want to display the result of that audit (in terms of passing quality control or failing it) on the dashboard.
How might we get this information?

Well, the simplest code is something like this:

```ruby
if @order.shipment && @order.shipment.shipment_audit then
  @order.shipment.shipment_audit.status
else
  nil
end
```

That's sort of gross.
Thankfully, Ruby provides a "safe navigation operator," which lets us simplify this quite a bit:

```ruby
@order&.shipment&.shipment_audit&.status
```

That is much nicer!
We don't need the conditional, we can simply describe how to get to the information and we're done.

