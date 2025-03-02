import { Card } from "@/components/ui/card";
import { Clock, User, Vote } from "lucide-react";
import React from "react";

const blogs = [
  {
    id: 1,
    blogTitle: "This is the title of a blog",
    summary:
      "Lorem ipsum dolor sit amet consectetur, adipisicing elit. Fugiat quasi aperiam quod, commodi asperiores enim optio ut eligendi amet modi laborum. Obcaecati, quaerat, vero similique reiciendis laudantium consequatur debitis minus incidunt non, dolore quibusdam! Ipsam perspiciatis omnis facere neque incidunt eum numquam esse quisquam, consequuntur unde necessitatibus placeat deleniti impedit.",
    read: 3,
    contributor: "Achille",
    votes: 100,
  },
  {
    id: 2,
    blogTitle: "This is the title of a blog",
    summary:
      "Lorem ipsum dolor sit amet consectetur, adipisicing elit. Fugiat quasi aperiam quod, commodi asperiores enim optio ut eligendi amet modi laborum. Obcaecati, quaerat, vero similique reiciendis laudantium consequatur debitis minus incidunt non, dolore quibusdam! Ipsam perspiciatis omnis facere neque incidunt eum numquam esse quisquam, consequuntur unde necessitatibus placeat deleniti impedit.",
    read: 3,
    contributor: "Achille",
    votes: 100,
  },
  {
    id: 3,
    blogTitle: "This is the title of a blog",
    summary:
      "Lorem ipsum dolor sit amet consectetur, adipisicing elit. Fugiat quasi aperiam quod, commodi asperiores enim optio ut eligendi amet modi laborum. Obcaecati, quaerat, vero similique reiciendis laudantium consequatur debitis minus incidunt non, dolore quibusdam! Ipsam perspiciatis omnis facere neque incidunt eum numquam esse quisquam, consequuntur unde necessitatibus placeat deleniti impedit.",
    read: 3,
    contributor: "Achille",
    votes: 100,
  },
  {
    id: 4,
    blogTitle: "This is the title of a blog",
    summary:
      "Lorem ipsum dolor sit amet consectetur, adipisicing elit. Fugiat quasi aperiam quod, commodi asperiores enim optio ut eligendi amet modi laborum. Obcaecati, quaerat, vero similique reiciendis laudantium consequatur debitis minus incidunt non, dolore quibusdam! Ipsam perspiciatis omnis facere neque incidunt eum numquam esse quisquam, consequuntur unde necessitatibus placeat deleniti impedit.",
    read: 3,
    contributor: "Achille",
    votes: 100,
  },
  {
    id: 5,
    blogTitle: "This is the title of a blog",
    summary:
      "Lorem ipsum dolor sit amet consectetur, adipisicing elit. Fugiat quasi aperiam quod, commodi asperiores enim optio ut eligendi amet modi laborum. Obcaecati, quaerat, vero similique reiciendis laudantium consequatur debitis minus incidunt non, dolore quibusdam! Ipsam perspiciatis omnis facere neque incidunt eum numquam esse quisquam, consequuntur unde necessitatibus placeat deleniti impedit.",
    read: 3,
    contributor: "Achille",
    votes: 100,
  },
  {
    id: 6,
    blogTitle: "This is the title of a blog",
    summary:
      "Lorem ipsum dolor sit amet consectetur, adipisicing elit. Fugiat quasi aperiam quod, commodi asperiores enim optio ut eligendi amet modi laborum. Obcaecati, quaerat, vero similique reiciendis laudantium consequatur debitis minus incidunt non, dolore quibusdam! Ipsam perspiciatis omnis facere neque incidunt eum numquam esse quisquam, consequuntur unde necessitatibus placeat deleniti impedit.",
    read: 3,
    contributor: "Achille",
    votes: 100,
  },
];

function BlogList() {
  return (
    <div className="grid grid-cols-2 gap-4">
      {blogs.length > 0 &&
        blogs.slice(0, 4).map((item, index) => {
          return (
            <div key={index + 1} className="min-w-[400px]">
              <Card className="max-w-md mx-auto h-full cursor-pointer shadow-lg rounded-lg">
                <img
                  className="w-full h-64 object-cover object-center"
                  src={"https://i.ytimg.com/vi/6P1E-i4wGwc/maxresdefault.jpg"}
                  alt={item?.blogTitle}
                />
                <div className="px-6 py-4">
                  <h2 className="text-xl font-semibold mb-2">
                    {item?.blogTitle}
                  </h2>
                  <p className="text-gray-600 mb-2">
                    {item?.summary.slice(0, 200)}
                  </p>
                  <div className="flex items-center flex-wrap gap-2">
                    <div className="flex items-center">
                      <Clock className="text-gray-400 mr-1" />
                      <p className="text-sm text-gray-400">
                        {item?.read} minutes
                      </p>
                    </div>
                    <div className="flex items-center">
                      <Vote className="text-gray-400 mr-1" />
                      <p className="text-sm text-gray-400">
                        {item?.votes} Votes
                      </p>
                    </div>
                    <div className="flex items-center">
                      <User className="text-gray-400 mr-1" />
                      <p className="text-sm text-gray-400">
                        Written by {item?.contributor}
                      </p>
                    </div>
                  </div>
                </div>
              </Card>
            </div>
          );
        })}
    </div>
  );
}

export default BlogList;
