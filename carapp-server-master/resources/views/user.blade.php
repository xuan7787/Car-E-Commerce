@extends('adminlte::page')

@section('title', 'Square')

@section('content_header')
    <h1>Users<button type="button" class="btn btn-sm btn-info" style="display:inline-block;float:right" data-toggle="modal" data-target="#add-user">Add</button></h1>
@stop

@section('content')
    <div class="row">
        <table class="table">
            <tr>
                <th>Id</th>
                <th>Username</th>
                <th>Email</th>
                <th>Last Login</th>
            </tr>
            @forelse($users as $user)
                <tr>
                    <td>{{$user->id}}</td>
                    <td>{{$user->username}}</td>
                    <td>{{$user->email}}</td>
                    <td>{{$user->updated_at}}</td>
                    <td>
                        <button id = "{{$user->email}}" class="btn btn-sm btn-success view-user-btn" data-toggle="modal" data-target="#view-user">View</button>
                        <button id = "{{$user->email}}" class="btn btn-sm btn-warning update-user-btn" data-toggle="modal" data-target="#edit-user">Edit</button>
                        <button id = "{{$user->email}}" class="btn btn-sm btn-danger delete-user-btn" data-toggle="modal" data-target="#add-new-user">Delete</button>
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
    <div class="modal fade" id="add-user" tabindex="-1" role="dialog" aria-labelledby="exampleModalCenterTitle" aria-hidden="true">
        <div class="modal-dialog modal-dialog-centered" role="document">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title">Add User
                        <button type="button" class="close" data-dismiss="modal" aria-label="Close" style="float:right">
                            <span aria-hidden="true">&times;</span>
                        </button>
                    </h5>

                </div>
                <form id="add-user-form" enctype="multipart/form-data">
                    <div class="modal-body">
                        <label>Username: </label>
                        <input type="text" id="add-username" name="username"/>
                        <br>
                        <label>Email: </label>
                        <input type="text" id="add-email" name="email"/>
                        <br>
                        <label>Password: </label>
                        <input type="password" id="add-password" name="password"/>
                        <br>
                        <label>Re-enter Password: </label>
                        <input type="password" id="add-password-cfm" name="password_confirmation"/>
                        <br>
                        <label>First Name: </label>
                        <input type="text" id="add-first-name" name="first-name"/>
                        <br>
                        <label>Last Name: </label>
                        <input type="text" id="add-last-name" name="last-name"/>
                        <br>
                        <input type="hidden" id="add-profile" name="profile-img"/>
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
    <div class="modal fade" id="view-user" tabindex="-1" role="dialog" aria-labelledby="exampleModalCenterTitle" aria-hidden="true">
        <div class="modal-dialog modal-dialog-centered" role="document">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title">View User
                        <button type="button" class="close" data-dismiss="modal" aria-label="Close" style="float:right">
                            <span aria-hidden="true">&times;</span>
                        </button>
                    </h5>

                </div>
                <div class="modal-body">
                    <p>User id: <span id="view-id"></span></p>
                    <p>Username: <span id="view-username"></span></p>
                    <p>First name: <span id="view-firstName"></span></p>
                    <p>Last name: <span id="view-lastName"></span></p>
                    <p>Email: <span id="view-email"></span></p>
                    <p>Profile : <span id="view-profile"></span></p>
                    <p>Api token: <span id="view-apiToken"></span></p>
                    <p>Created at: <span id="view-createdAt"></span></p>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
                    <button type="button" class="btn btn-primary">Save changes</button>

                </div>
            </div>
        </div>
    </div>

    <!-- Modal -->
    <div class="modal fade" id="edit-user" tabindex="-1" role="dialog" aria-labelledby="exampleModalCenterTitle" aria-hidden="true">
        <div class="modal-dialog modal-dialog-centered" role="document">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title">Edit User
                        <button type="button" class="close" data-dismiss="modal" aria-label="Close" style="float:right">
                            <span aria-hidden="true">&times;</span>
                        </button>
                    </h5>

                </div>
                <form id="update-user-form" enctype="multipart/form-data">
                    <div class="modal-body">
                        <label>Username: </label>
                        <input type="text" name="username" id="update-username"/>
                        <br>
                        <label>Email: </label>
                        <input type="text" name="email" id="update-email"/>
                        <br>
                        <label>Password: </label>
                        <input type="password" name="password" id="update-password"/>
                        <br>
                        <label>First Name: </label>
                        <input type="text" name="first-name" id="update-first-name"/>
                        <br>
                        <label>Last Name: </label>
                        <input type="text" name="last-name" id="update-last-name"/>
                        <br>
                        <input type="hidden" name="profile-img" id="update-profile"/>
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

    <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.3.1/jquery.min.js"></script>
    <script>
        $(document).ready(function(){
            $('.modal-close-btn').click(function(){
                $('#add-user-form').trigger("reset");

            });

            $(".view-user-btn").click(function()
            {
                var id= this.id;

                var params ={
                    'email': id
                }
                $.ajax({
                    type: 'get',
                    url:'api/user-info-a',
                    data: params,
                    success: function(data){
                        var info = data['user'][0];
                        $("#view-id").text(info['id']);
                        $("#view-username").text(info['username']);
                        $("#view-firstName").text(info['first-name']);
                        $("#view-lastName").text(info['last-name']);
                        $("#view-email").text(info['email']);
                        $("#view-password").text(info['password']);
                        $("#view-profile").text(info['profile']);
                        $("#view-apiToken").text(info['api_token']);
                        $("#view-createdAt").text(info['created_at']);
                    }
                });
            });

            $(".update-user-btn").click(function()
            {
                var id= this.id;

                var params ={
                    'email': id
                }
                $.ajax({
                    type: 'get',
                    url:'api/user-info-a',
                    data: params,
                    success: function(data){
                        var info = data['user'][0];
                        $("#update-username").val(info['username']);
                        $("#update-email").val(info['email']);
                        $("#update-password").val(info['password']);
                        $("#update-first-name").val(info['first-name']);
                        $("#update-last-name").val(info['last-name']);
                        $("#update-profile").val(info['profile']);
                    }
                });
            });

            $(".delete-user-btn").click(function()
            {
                var id= this.id;

                var params ={
                    'email': id
                }
                $.ajax({
                    type: 'get',
                    url:'api/user-delete-a',
                    data: params,
                    success: function(data){
                        alert(data.state);
                        window.location.href = "user";
                    }
                });
            });

            $("#add-user-form").submit(function(e)
            {
                e.preventDefault();
                var params ={
                    'username': $("#add-username").val(),
                    'email': $("#add-email").val(),
                    'password': $("#add-password").val(),
                    'password_confirmation': $("#add-password-cfm").val(),
                    'first-name': $("#add-first-name").val(),
                    'last-name': $("#add-last-name").val(),
                    'profile-img': $("#add-profile").val(),
                }
                $.ajax({
                    type: 'post',
                    url:'api/register',
                    data: params,
                    crossDomain: true,
                    success: function(data){
                        alert(data.state);
                        window.location.href = "user";
                    }
                });
            });

            $("#update-user-form").submit(function(e)
            {
                e.preventDefault();
                var params ={
                    'username': $("#update-username").val(),
                    'email': $("#update-email").val(),
                    'password': $("#update-password").val(),
                    'first-name': $("#update-first-name").val(),
                    'last-name': $("#update-last-name").val(),
                    'profile-img': $("#update-profile").val(),
                }
                $.ajax({
                    type: 'post',
                    url:'api/user-update-a',
                    data: params,
                    crossDomain: true,
                    success: function(data){
                        alert(data.state);
                        window.location.href = "user";
                    }
                });
            });
        });
    </script>
@stop