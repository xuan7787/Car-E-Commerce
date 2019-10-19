@extends('adminlte::page')

@section('title', 'Square')

@section('content_header')
    <h1>Car Post <a href="" class="btn btn-sm btn-info" style="display:inline-block;float:right">Add</a></h1>
@stop

@section('content')
    <div class="row">
        <table class="table">
            <tr>
                <th>Id</th>
                <th>Name</th>
                <th>Price</th>
                <th>Post_by</th>
            </tr>
            @forelse($posts as $post)
                <tr>
                    <td>{{$post->id}}</td>
                    <td>{{$post->name}}</td>
                    <td>{{$post->price}}</td>
                    <td>{{$post->post_by}}</td>
                    <td>
                        <a href="" class="btn btn-sm btn-success">View</a>
                        <a href="" class="btn btn-sm btn-warning">Edit</a>
                        <a href="" class="btn btn-sm btn-danger">Delete</a>
                    </td>
                </tr>
            @empty
                <tr>
                    <td colspan="2">No records found.</td>
                </tr>
            @endforelse
        </table>
    </div>
@stop