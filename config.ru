require 'rack/reverse_proxy'

OAR_API_URL = 'http://localhost:8888/oarapi'

use Rack::ReverseProxy do
  reverse_proxy_options :preserve_host => true
  reverse_proxy '/oarapi', OAR_API_URL
end

app = proc do |env|
  Rack::Directory.new(Dir.pwd).call(env)
end

run app
