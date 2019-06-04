<?php

namespace App\Api\V1\Core\Controllers;

use Symfony\Component\HttpKernel\Exception\HttpException;
use Tymon\JWTAuth\JWTAuth;
use App\Http\Controllers\Controller;
use Tymon\JWTAuth\Exceptions\JWTException;
use Symfony\Component\HttpKernel\Exception\AccessDeniedHttpException;
use App\Api\V1\Core\Requests\CreateContactRequest;
use App\Api\V1\Core\Requests\UpdateContactRequest;
use App\Models\Core\Contact;
use Auth;


class ContactController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        try {
            $contact = Contact::latest()->get();
        } catch (JWTException $e) {
            throw new HttpException(500);
        }
        return response()->json($contact);
    }
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function company($id)
    {
        try {
            $contact = Contact::where('taggable_type','Company')->where('taggable_id',$id)->latest()->get();
        } catch (JWTException $e) {
            throw new HttpException(500);
        }
        return response()->json($contact);
    }

    /**
     * Show the form for creating a new resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(CreateContactRequest $request)
    {
        try {
            $contact = new Contact($request->all());
            $contact->save();
            activity()->causedBy(Auth::user())->performedOn($contact)->withProperties($contact)->log('Created Successfully');
        } catch (JWTException $e) {
            throw new HttpException(500);
        }
        return response()->json($contact);
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
            $contact = Contact::findOrFail($id);
        } catch (JWTException $e) {
            throw new HttpException(500);
        }
        return response()->json($contact);
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
    public function update(UpdateContactRequest $request, $id)
    {
        try {
            $contact = Contact::findOrFail($id);
            $contact->update($request->all());
            activity()->causedBy(Auth::user())->performedOn($contact)->withProperties($contact)->log('Updated Successfully');
        } catch (JWTException $e) {
            throw new HttpException(500);
        }
        return response()->json($contact);
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
            $contact = Contact::findOrFail($id);
            $contact->delete();
            activity()->causedBy(Auth::user())->performedOn($contact)->withProperties($contact)->log('Deleted Successfully');
        } catch (JWTException $e) {
            throw new HttpException(500);
        }
        return response()->json($contact);
    }
}
