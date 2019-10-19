<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class accessoriesImgController extends Controller
{
    public function uploadPostImg(Request $request)
    {
        if ($request->hasFile('postImg')) {
            $allowFileExtension = ['jpg', 'png', 'jpeg'];

            $files = $request->file('postImg');

            foreach ($files as $index => $file) {
                $filename = str_random(6) . '-' . time();

                $extension = $file->getClientOriginalExtension();

                $check = in_array($extension, $allowFileExtension);

//                dd($request->all());

                if ($check) {
                    $file->move(public_path('post image'), $filename);

                    $postImgs = postImg::create(['file_name' => $filename, 'post_id' => $this->id, 'img_sequence' => $index]);

                    echo "Upload Successfully";

                } else {
                    echo "Fail to upload";
                }
            }
        }
    }
}
