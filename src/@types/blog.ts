// Create Blog Response
/*
{
    "success": true,
    "data": [
        {
            "title": "Shan Noodles",
            "content": "<p><strong>Article about shan noodles</strong></p>",
            "restaurant": {
                "id": "b99b65ce-fef3-4fc1-aaf6-1e5c565eaa3a"
            },
            "authorOwner": {
                "id": "69ef158c-5318-478a-a7d7-1e26d33e40b2"
            },
            "linkedDish": {
                "id": "87ccf2bb-0518-4c3e-aa8f-a3efeb639f14"
            },
            "id": "3e0d4039-ae3b-4afc-8a41-15bc01b6b9a5",
            "viewCount": 0,
            "created_at": "2026-05-26T08:24:52.579Z",
            "updated_at": "2026-05-26T08:24:52.579Z",
            "image": {
                "0": {
                    "key": "restaurants/blog/1779783869813-shan-noodle-1.png",
                    "url": ""
                },
                "1": {
                    "key": "restaurants/blog/1779783878168-shan-noodle-2.png",
                    "url": ""
                },
                "2": {
                    "key": "restaurants/blog/1779783887902-shan-noodle-3.png",
                    "url": ""
                }
            }
        }
    ],
    "message": "blog created successfully"
}
*/

// ========== Get Blog By Id ==========
/*
{
    "success": true,
    "data": {
        "id": "3e0d4039-ae3b-4afc-8a41-15bc01b6b9a5",
        "title": "Shan Noodles",
        "content": "<p><strong>Article about shan noodles</strong></p>",
        "viewCount": 1,
        "created_at": "2026-05-26T08:24:52.579Z",
        "updated_at": "2026-05-26T08:24:52.579Z",
        "linkedDish": {
            "id": "87ccf2bb-0518-4c3e-aa8f-a3efeb639f14",
            "name": "Shan Burger",
            "coverImageUrl": "dishes/cover/1778576874759-Burger.png",
            "price": 6000,
            "detailImageUrls": [
                "dishes/details/1778568632554-shan-noodle-1.png"
            ],
            "availableForOrder": true,
            "description": "A very delicious noodles with two detail image. Sorry, i mean with one detail image.",
            "preparationTime": 14,
            "created_at": "2026-05-12T06:50:32.831Z",
            "updated_at": "2026-05-25T16:07:52.057Z"
        },
        "restaurant": {
            "id": "b99b65ce-fef3-4fc1-aaf6-1e5c565eaa3a",
            "name": "Ice Berry",
            "address": "45 ward, North Dagon, Yangon",
            "imageUrls": [
                "restaurants/gallery/1778445368080-restaurant-5.png",
                "restaurants/gallery/1778445368197-restaurant-2.png",
                "restaurants/gallery/1778445368296-restaurant-3.png"
            ],
            "startingPrice": 2000,
            "endingPrice": 5000000,
            "latitude": "16.8786398",
            "longitude": "96.1903667",
            "averageRating": "0.0",
            "totalReviews": 0,
            "created_at": "2026-05-10T20:36:08.384Z",
            "updated_at": "2026-05-25T16:37:36.966Z"
        },
        "image": [
            {
                "key": "restaurants/blog/1779783869813-shan-noodle-1.png",
                "url": "https://sgp1.digitaloceanspaces.com/royal-plate-object-storage/restaurants/blog/1779783869813-shan-noodle-1.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=DO8012YGNLG8HJ9H2FVQ%2F20260526%2Fsgp1%2Fs3%2Faws4_request&X-Amz-Date=20260526T082722Z&X-Amz-Expires=3600&X-Amz-Signature=dc1151ae253f8fc5c27c125292c9805e86e804bf6ae005434ba50050eab047c2&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject"
            },
            {
                "key": "restaurants/blog/1779783878168-shan-noodle-2.png",
                "url": "https://sgp1.digitaloceanspaces.com/royal-plate-object-storage/restaurants/blog/1779783878168-shan-noodle-2.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=DO8012YGNLG8HJ9H2FVQ%2F20260526%2Fsgp1%2Fs3%2Faws4_request&X-Amz-Date=20260526T082722Z&X-Amz-Expires=3600&X-Amz-Signature=21f912eaf069b7cb9a7b38a8ba98bef698e230d5a675103c433b2e16dfe1e62c&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject"
            },
            {
                "key": "restaurants/blog/1779783887902-shan-noodle-3.png",
                "url": "https://sgp1.digitaloceanspaces.com/royal-plate-object-storage/restaurants/blog/1779783887902-shan-noodle-3.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=DO8012YGNLG8HJ9H2FVQ%2F20260526%2Fsgp1%2Fs3%2Faws4_request&X-Amz-Date=20260526T082722Z&X-Amz-Expires=3600&X-Amz-Signature=8653b4d0770d306534212936a6c9096bd1d1e1270c887bf0bbefc92938bb4048&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject"
            }
        ]
    },
    "message": "Blog story retrieved successfully."
}
*/

// ========== Update Blog ==============
/*
{
    "success": true,
    "data": {
        "id": "3e0d4039-ae3b-4afc-8a41-15bc01b6b9a5",
        "title": "Shan Noodles",
        "content": "<p><strong>Article about shan noodles</strong></p>",
        "viewCount": 1,
        "created_at": "2026-05-26T08:24:52.579Z",
        "updated_at": "2026-05-26T08:27:22.230Z",
        "restaurant": {
            "id": "b99b65ce-fef3-4fc1-aaf6-1e5c565eaa3a",
            "name": "Ice Berry",
            "address": "45 ward, North Dagon, Yangon",
            "imageUrls": [
                "restaurants/gallery/1778445368080-restaurant-5.png",
                "restaurants/gallery/1778445368197-restaurant-2.png",
                "restaurants/gallery/1778445368296-restaurant-3.png"
            ],
            "startingPrice": 2000,
            "endingPrice": 5000000,
            "latitude": "16.8786398",
            "longitude": "96.1903667",
            "averageRating": "0.0",
            "totalReviews": 0,
            "created_at": "2026-05-10T20:36:08.384Z",
            "updated_at": "2026-05-25T16:37:36.966Z",
            "owner": {
                "id": "69ef158c-5318-478a-a7d7-1e26d33e40b2",
                "name": "Bhone Myat",
                "phone": null,
                "email": "bmkyawstudent14@gmail.com",
                "password": "$2b$12$OghYVbp3KZnhi32DIx4HaeqLy3.sXct08y.LSfAbgQ2r4JlKBAC9q",
                "code": null,
                "created_at": "2026-05-07T09:31:59.939Z",
                "updated_at": "2026-05-07T09:31:59.939Z"
            },
            "staff": [
                {
                    "id": "1e7ae763-1fc6-447d-a87d-6049c0ef38cc",
                    "name": "Bo Min",
                    "email": "bomin@faker.com",
                    "password": "$2b$12$diEHJ2aDJTxWXk3CGEmf.OJeU7mVtFhvBxSo/bLfpUsZ5AfwZ6Imy",
                    "role": "staff",
                    "created_at": "2026-05-17T16:09:11.741Z",
                    "updated_at": "2026-05-17T18:15:33.611Z"
                },
                {
                    "id": "e256d4a9-9007-4bbf-8d96-a3ee5bf89bf6",
                    "name": "John",
                    "email": "john@restaurant.com",
                    "password": "$2b$12$U6GbSTiMfcuGV3CYp6NHKOAL9ceC8za3tGLc2PHmA3mZtVP8ObFGm",
                    "role": "staff",
                    "created_at": "2026-05-25T04:37:55.982Z",
                    "updated_at": "2026-05-25T04:37:55.982Z"
                }
            ]
        },
        "linkedDish": {
            "id": "87ccf2bb-0518-4c3e-aa8f-a3efeb639f14"
        },
        "image": [
            {
                "key": "restaurants/blog/1779783869813-shan-noodle-1.png",
                "url": "https://sgp1.digitaloceanspaces.com/royal-plate-object-storage/restaurants/blog/1779783869813-shan-noodle-1.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=DO8012YGNLG8HJ9H2FVQ%2F20260526%2Fsgp1%2Fs3%2Faws4_request&X-Amz-Date=20260526T083142Z&X-Amz-Expires=3600&X-Amz-Signature=8d811c61e4bc9a84f966e7696ff6ca6aa3f790830865a69c7a00857122b0a87a&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject"
            },
            {
                "key": "restaurants/blog/1779783878168-shan-noodle-2.png",
                "url": "https://sgp1.digitaloceanspaces.com/royal-plate-object-storage/restaurants/blog/1779783878168-shan-noodle-2.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=DO8012YGNLG8HJ9H2FVQ%2F20260526%2Fsgp1%2Fs3%2Faws4_request&X-Amz-Date=20260526T083142Z&X-Amz-Expires=3600&X-Amz-Signature=18bdff9e880260b0c3daa2d572af877add0de989d52925ef15a1967c2255410a&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject"
            },
            {
                "key": "restaurants/blog/1779783887902-shan-noodle-3.png",
                "url": "https://sgp1.digitaloceanspaces.com/royal-plate-object-storage/restaurants/blog/1779783887902-shan-noodle-3.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=DO8012YGNLG8HJ9H2FVQ%2F20260526%2Fsgp1%2Fs3%2Faws4_request&X-Amz-Date=20260526T083142Z&X-Amz-Expires=3600&X-Amz-Signature=283781a9d260e526e43b74f18e70792909a58cc03d93c022467a05bd9bd1374b&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject"
            }
        ]
    },
    "message": "Blog was updated successfully"
}
*/
