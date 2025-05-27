"use client";

import { Metadata } from "next";
import { PlusCircle } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { listenNowAlbums, madeForYouAlbums } from "./data/album";
import { AlbumArtwork } from "./AlbumArtwork";

export const metadata: Metadata = {
  title: "Music App",
  description: "Example music app using the components.",
};

export default function GalleryPage() {
  return (
    <div className="md:block mx-auto w-full">
      <div className="border-t">
        <div className="bg-background">
          <div className="lg:col-span-4 lg:border-l">
            <div className="h-full px-4 py-6 lg:px-8">
              <Tabs defaultValue="gallery" className="h-full">
                <div className="space-between flex items-center">
                  <TabsList>
                    <TabsTrigger value="gallery" className="relative">
                      Gallery Items
                    </TabsTrigger>
                    <TabsTrigger value="documents">Documents</TabsTrigger>
                    <TabsTrigger value="images" disabled>
                      Images
                    </TabsTrigger>
                  </TabsList>
                  <div className="ml-auto mr-4">
                    <Button>
                      <PlusCircle />
                      Add New Item
                    </Button>
                  </div>
                </div>
                <TabsContent
                  value="gallery"
                  className="border-none p-0 outline-none"
                >
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <h2 className="text-2xl font-semibold tracking-tight">
                        Images
                      </h2>
                      <p className="text-sm text-muted-foreground">
                        Image items available in the gallery.
                      </p>
                    </div>
                  </div>
                  <Separator className="my-4" />
                  <div className="relative">
                    <ScrollArea>
                      <div className="flex space-x-4 pb-4">
                        {listenNowAlbums.map((album) => (
                          <AlbumArtwork
                            key={album.name}
                            album={album}
                            className="w-[250px]"
                            aspectRatio="portrait"
                            width={250}
                            height={330}
                          />
                        ))}
                      </div>
                      <ScrollBar orientation="horizontal" />
                    </ScrollArea>
                  </div>
                  <div className="mt-6 space-y-1">
                    <h2 className="text-2xl font-semibold tracking-tight">
                      Documents
                    </h2>
                    <p className="text-sm text-muted-foreground">
                      Documents in PDF, PPT, and Excel available on the server
                    </p>
                  </div>
                  <Separator className="my-4" />
                  <div className="relative">
                    <ScrollArea>
                      <div className="flex space-x-4 pb-4">
                        {madeForYouAlbums.map((album) => (
                          <AlbumArtwork
                            key={album.name}
                            album={album}
                            className="w-[150px]"
                            aspectRatio="square"
                            width={150}
                            height={150}
                          />
                        ))}
                      </div>
                      <ScrollBar orientation="horizontal" />
                    </ScrollArea>
                  </div>
                  <div className="mt-6 space-y-1">
                    <h2 className="text-2xl font-semibold tracking-tight">
                      Videos
                    </h2>
                    <p className="text-sm text-muted-foreground">
                      Videos added to the organization gallery from YouTube and
                      upload.
                    </p>
                  </div>
                  <Separator className="my-4" />
                  <div className="relative">
                    <ScrollArea>
                      <div className="flex space-x-4 pb-4">
                        {madeForYouAlbums.map((album) => (
                          <AlbumArtwork
                            key={album.name}
                            album={album}
                            className="w-[150px]"
                            aspectRatio="square"
                            width={150}
                            height={150}
                          />
                        ))}
                      </div>
                      <ScrollBar orientation="horizontal" />
                    </ScrollArea>
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
