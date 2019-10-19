<?php

namespace App;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Notifications\Notifiable;
use Illuminate\Http\Request;

class CarListing extends Model
{
    //
    use Notifiable;

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'name', 'price', 'registration_date', 'mileage', 'seats', 'doors','description','owners','manufactured',
        'omv', 'arf', 'deregistration_val', 'bhp', 'engine_capacity', 'road_tax','post_by','type','make','transmission',
        'plate_number', 'coe', 'coe_expiry_date','fuel','sold_by','mobile_number','email'
    ];

    public function uploadPostImg(Request $request)
    {
        $allowFileExtension = ['jpg', 'png', 'jpeg'];
        $files = $request->file('postImg');

        foreach ($files as $index => $file)
        {
            $filename = str_random(6) . '-' . time();

            $extension = $file->getClientOriginalExtension();

            $check = in_array($extension, $allowFileExtension);

            if ($check) {
                $file->move(public_path('post-image'), $filename);
                $postImgs = postImg::create(['file_name' => $filename, 'post_id' => $this->id, 'img_sequence' => $index]);
            }

            else {
                echo "Fail to upload";
            }
        }
    }

    public function uploadAccessoryImg(Request $request)
    {
        $allowFileExtension = ['jpg', 'png', 'jpeg'];
        $files = $request->file('accessoriesImg');

        foreach ($files as $index => $file)
        {
            $filename = str_random(6) . '-' . time();
            $extension = $file->getClientOriginalExtension();
            $check = in_array($extension, $allowFileExtension);

            if ($check)
            {
                $file->move(public_path('accessories-image'), $filename);
                $accessoryImgs = accessoriesImg::create(['file_name' => $filename, 'post_id' => $this->id, 'img_sequence' => $index, 'description'=>$request['accessories_description'][$index],'category'=>$request['accessories_category'][$index]]);
            }
            else {
                echo "Fail to upload";
            }
        }
    }
}
