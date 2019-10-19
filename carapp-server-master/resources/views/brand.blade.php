@extends('adminlte::page')

@section('title', 'Square')

@section('content_header')
    <h1>Brands <button type="button" class="btn btn-sm btn-info" style="display:inline-block;float:right" data-toggle="modal" data-target="#add-brand">Add</button></h1>
@stop

@section('content')
    <div class="row">
        <table class="table">
            <tr>
                <th>Id</th>
                <th>Name</th>
            </tr>
            @forelse($brands as $brand)
                <tr>
                    <td>{{$brand->id}}</td>
                    <td>{{$brand->name}}</td>
                    <td>
                        <button id = "{{$brand->id}}" class="btn btn-sm btn-warning update-brand-btn" data-toggle="modal" data-target="#edit-brand">Edit</button>
                        <button id = "{{$brand->id}}" class="btn btn-sm btn-danger delete-brand-btn" data-toggle="modal" data-target="#add-new-user">Delete</button>
                    </td>
                </tr>
            @empty
                <tr>
                    <td colspan="2">No records found.</td>
                </tr>
            @endforelse
        </table>
    </div>

    <!-- Modal -->
    <div class="modal fade" id="add-brand" tabindex="-1" role="dialog" aria-labelledby="exampleModalCenterTitle" aria-hidden="true">
        <div class="modal-dialog modal-dialog-centered" role="document">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title">Add Brand
                        <button type="button" class="close" data-dismiss="modal" aria-label="Close" style="float:right">
                            <span aria-hidden="true">&times;</span>
                        </button>
                    </h5>

                </div>
                <form id="add-brand-form" enctype="multipart/form-data">
                    <div class="modal-body">
                        <label>Brand: </label>
                        <input type="text" id="add-name" name="name"/>
                        <br>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary modal-close-btn" data-dismiss="modal">Close</button>
                        <input type="submit" class="btn btn-primary" value="Submit" />
                    </div>
                </form>
            </div>
        </div>
    </div>

    <!-- Modal -->
    <div class="modal fade" id="edit-brand" tabindex="-1" role="dialog" aria-labelledby="exampleModalCenterTitle" aria-hidden="true">
        <div class="modal-dialog modal-dialog-centered" role="document">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title">Edit Brand
                        <button type="button" class="close" data-dismiss="modal" aria-label="Close" style="float:right">
                            <span aria-hidden="true">&times;</span>
                        </button>
                    </h5>

                </div>
                <form id="update-brand-form" enctype="multipart/form-data">
                    <div class="modal-body">
                        <input type="hidden" name="name" id="update-id"/>
                        <label>Name: </label>
                        <input type="text" name="name" id="update-name"/>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary modal-close-btn" data-dismiss="modal">Close</button>
                        <input type="submit" class="btn btn-primary" value="Submit" />
                    </div>
                </form>
            </div>
        </div>
    </div>

    <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.3.1/jquery.min.js"></script>
    <script>
        $(document).ready(function(){
            $('.modal-close-btn').click(function(){
                $('#add-user-form').trigger("reset");

            });

            $("#add-brand").submit(function(e)
            {
                e.preventDefault();
                var params ={
                    'name': $("#add-name").val(),
                }
                $.ajax({
                    type: 'post',
                    url:'api/add-brand',
                    data: params,
                    crossDomain: true,
                    success: function(data){
                        alert(data.state);
                        window.location.href = "brand";
                    }
                });
            });

            $(".update-brand-btn").click(function()
            {
                var id= this.id;

                var params ={
                    'id': id
                }
                $.ajax({
                    type: 'get',
                    url:'api/get-brand',
                    data: params,
                    success: function(data){
                        var info = data['brand'][0];
                        $("#update-id").val(info['id']);
                        $("#update-name").val(info['name']);
                    }
                });
            });

            $("#update-brand-form").submit(function(e)
            {
                e.preventDefault();
                var params ={
                    'id':$("#update-id").val(),
                    'name': $("#update-name").val(),
                }
                $.ajax({
                    type: 'post',
                    url:'api/update-brand',
                    data: params,
                    crossDomain: true,
                    success: function(data){
                        alert(data.state);
                        window.location.href = "brand";
                    }
                });
            });

            $(".delete-brand-btn").click(function()
            {
                var id= this.id;

                var params ={
                    'id': id
                }
                $.ajax({
                    type: 'get',
                    url:'api/delete-brand',
                    data: params,
                    success: function(data){
                        alert(data.state);
                        window.location.href = "brand";
                    }
                });
            });
        });
    </script>
@stop