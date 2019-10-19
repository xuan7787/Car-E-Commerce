<?php

namespace App\Http\Controllers;

use App\postImg;
use Illuminate\Http\Request;

class postImgController extends Controller
{
    /**
     * Where to redirect users after login.
     *
     * @var string
     */
    protected $redirectTo = '/home';

    /**
     * Create a new controller instance.
     *
     * @return void
     */
    public function __construct()
    {
        $this->middleware('guest');
    }

//    public function uploadPostImg(Request $request)
//    {
//        if($request->hasFile('postImg'))
//        {
//            $allowFileExtension=['jpg','png','jpeg'];
//
//            $files = $request->file('postImg');
//
//            foreach ($files as $index=>$file)
//            {
//                $filename = str_random(6).'-'.time();
//
//                $extension = $file->getClientOriginalExtension();
//
//                $check = in_array($extension, $allowFileExtension);
//
////                dd($request->all());
//
//                if($check)
//                {
//                    $file->move(public_path('post image'), $filename);
//
//                    $postImgs = postImg::create(['file_name'=>$filename, 'post_id'=>2, 'img_sequence'=>$index]);
//
//                        echo "Upload Successfully";
//
////                        return response()->json([
////                            'data' => $postImgs
////                        ]);
////                    }
//                }
//                else{
//                    echo "Fail to upload";
//                }
//            }
//        }
    }
}
