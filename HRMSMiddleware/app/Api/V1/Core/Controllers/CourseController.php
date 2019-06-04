<?php

namespace App\Api\V1\Core\Controllers;

use Symfony\Component\HttpKernel\Exception\HttpException;
use Tymon\JWTAuth\JWTAuth;
use App\Http\Controllers\Controller;
use Tymon\JWTAuth\Exceptions\JWTException;
use Symfony\Component\HttpKernel\Exception\AccessDeniedHttpException;
use App\Api\V1\Core\Requests\CreateCourseRequest;
use App\Api\V1\Core\Requests\UpdateCourseRequest;
use App\Models\Core\Course;
use App\Models\Core\Config;
use Auth;


class CourseController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        try {
            $course = Course::with(['category'])->latest()->get();
            for ($i=0; $i < count($course); $i++) { 
                $course[$i]->categoryName = isset($course[$i]->category->name)?$course[$i]->category->name:'';
            }
        } catch (JWTException $e) {
            throw new HttpException(500);
        }
        return response()->json($course);
    }

    /**
     * Show the form for creating a new resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function create()
    {
        try {
            $categories = Config::where(['status'=>1,'config_item_id'=>15])->select('name','id')->orderBy('sort')->get(); 
        } catch (JWTException $e) {
            throw new HttpException(500);
        }
        return response()->json(['categories'=>$categories]);
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(CreateCourseRequest $request)
    {
        try {
            $course = new Course($request->all());
            $course->save();
            activity()->causedBy(Auth::user())->performedOn($course)->withProperties($course)->log('Created Successfully');
        } catch (JWTException $e) {
            throw new HttpException(500);
        }
        return response()->json($course);
    }

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        try {
            $course = Course::findOrFail($id);
        } catch (JWTException $e) {
            throw new HttpException(500);
        }
        return response()->json($course);
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function edit($id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function update(UpdateCourseRequest $request, $id)
    {
        try {
            $course = Course::findOrFail($id);
            $course->update($request->all());
            activity()->causedBy(Auth::user())->performedOn($course)->withProperties($course)->log('Updated Successfully');
        } catch (JWTException $e) {
            throw new HttpException(500);
        }
        return response()->json($course);
  }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {
        try {
            $course = Course::findOrFail($id);
            $course->delete();
            activity()->causedBy(Auth::user())->performedOn($course)->withProperties($course)->log('Deleted Successfully');
        } catch (JWTException $e) {
            throw new HttpException(500);
        }
        return response()->json($course);
    }
}

?>
