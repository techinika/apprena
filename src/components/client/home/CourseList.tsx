"use client"

import { Card } from "@/components/ui/card";
import { Clock, File, User, Video } from "lucide-react";
import React from "react";

const courses = [
  {
    id: 1,
    courseTitle: "This is the title of a course",
    summary:
      "Lorem ipsum dolor sit amet consectetur, adipisicing elit. Fugiat quasi aperiam quod, commodi asperiores enim optio ut eligendi amet modi laborum. Obcaecati, quaerat, vero similique reiciendis laudantium consequatur debitis minus incidunt non, dolore quibusdam! Ipsam perspiciatis omnis facere neque incidunt eum numquam esse quisquam, consequuntur unde necessitatibus placeat deleniti impedit.",
    duration: 3,
    instructor: "Achille",
  },
  {
    id: 2,
    courseTitle: "This is the title of a course",
    summary:
      "Lorem ipsum dolor sit amet consectetur, adipisicing elit. Fugiat quasi aperiam quod, commodi asperiores enim optio ut eligendi amet modi laborum. Obcaecati, quaerat, vero similique reiciendis laudantium consequatur debitis minus incidunt non, dolore quibusdam! Ipsam perspiciatis omnis facere neque incidunt eum numquam esse quisquam, consequuntur unde necessitatibus placeat deleniti impedit.",
    duration: 3,
    instructor: "Achille",
  },
  {
    id: 3,
    courseTitle: "This is the title of a course",
    summary:
      "Lorem ipsum dolor sit amet consectetur, adipisicing elit. Fugiat quasi aperiam quod, commodi asperiores enim optio ut eligendi amet modi laborum. Obcaecati, quaerat, vero similique reiciendis laudantium consequatur debitis minus incidunt non, dolore quibusdam! Ipsam perspiciatis omnis facere neque incidunt eum numquam esse quisquam, consequuntur unde necessitatibus placeat deleniti impedit.",
    duration: 3,
    instructor: "Achille",
  },
  {
    id: 4,
    courseTitle: "This is the title of a course",
    summary:
      "Lorem ipsum dolor sit amet consectetur, adipisicing elit. Fugiat quasi aperiam quod, commodi asperiores enim optio ut eligendi amet modi laborum. Obcaecati, quaerat, vero similique reiciendis laudantium consequatur debitis minus incidunt non, dolore quibusdam! Ipsam perspiciatis omnis facere neque incidunt eum numquam esse quisquam, consequuntur unde necessitatibus placeat deleniti impedit.",
    duration: 3,
    instructor: "Achille",
  },
  {
    id: 5,
    courseTitle: "This is the title of a course",
    summary:
      "Lorem ipsum dolor sit amet consectetur, adipisicing elit. Fugiat quasi aperiam quod, commodi asperiores enim optio ut eligendi amet modi laborum. Obcaecati, quaerat, vero similique reiciendis laudantium consequatur debitis minus incidunt non, dolore quibusdam! Ipsam perspiciatis omnis facere neque incidunt eum numquam esse quisquam, consequuntur unde necessitatibus placeat deleniti impedit.",
    duration: 3,
    instructor: "Achille",
  },
  {
    id: 6,
    courseTitle: "This is the title of a course",
    summary:
      "Lorem ipsum dolor sit amet consectetur, adipisicing elit. Fugiat quasi aperiam quod, commodi asperiores enim optio ut eligendi amet modi laborum. Obcaecati, quaerat, vero similique reiciendis laudantium consequatur debitis minus incidunt non, dolore quibusdam! Ipsam perspiciatis omnis facere neque incidunt eum numquam esse quisquam, consequuntur unde necessitatibus placeat deleniti impedit.",
    duration: 3,
    instructor: "Achille",
  },
];

function CourseList() {
  return (
    <div className="grid grid-cols-2 gap-4">
      {courses.length > 0 &&
        courses.slice(0, 4).map((item, index) => {
          return (
            <div key={index + 1} className="min-w-[400px]">
              <Card className="max-w-md mx-auto h-full cursor-pointer shadow-lg rounded-lg">
                <img
                  className="w-full h-64 object-cover object-center"
                  src={
                    // course.image ||
                    "https://i.ytimg.com/vi/6P1E-i4wGwc/maxresdefault.jpg"
                  }
                  alt={item?.courseTitle}
                />
                <div className="px-6 py-4">
                  <h2 className="text-xl font-semibold mb-2">
                    {item?.courseTitle}
                  </h2>
                  <p className="text-gray-600 mb-2">
                    {item?.summary.slice(0, 200)}
                  </p>
                  <div className="flex items-center flex-wrap gap-2">
                    <div className="flex items-center">
                      <Clock className="text-gray-400 mr-1" />
                      <p className="text-sm text-gray-400">
                        {item?.duration} hours
                      </p>
                    </div>
                    <div className="flex items-center">
                      <Video className="text-gray-400 mr-1" />
                      <p className="text-sm text-gray-400">Video lessons</p>
                    </div>
                    <div className="flex items-center">
                      <File className="text-gray-400 mr-1" />
                      <p className="text-sm text-gray-400">PDF documents</p>
                    </div>
                    <div className="flex items-center">
                      <User className="text-gray-400 mr-1" />
                      <p className="text-sm text-gray-400">
                        Taught by {item?.instructor}
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

export default CourseList;
