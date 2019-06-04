<?php

namespace App\Http\Middleware;
use Symfony\Component\HttpKernel\Exception\AccessDeniedHttpException;

use Closure;

class DeviceAccess
{
    /**
     * Handle an incoming request.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \Closure  $next
     * @return mixed
     */
    public function handle($request, Closure $next)
    {
        $token = $request->header('Authorization');
        if (!$token ||  $token !== 'C93BE7B6-25AB-47E6-95AD-7902F42C0FA5') {
            throw new AccessDeniedHttpException();
        }
        return $next($request);
    }
}
