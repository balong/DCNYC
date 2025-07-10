create or replace view restaurants_with_style_and_rating as
with restaurant_reviews as (
    select
        restaurant_id,
        avg(rating) as average_rating,
        count(id) as review_count,
        (array_agg(style order by style))[1] as dominant_style
    from reviews
    group by restaurant_id
)
select
    r.*,
    rr.average_rating,
    rr.review_count,
    rr.dominant_style
from restaurants r
join restaurant_reviews rr on r.id = rr.restaurant_id; 