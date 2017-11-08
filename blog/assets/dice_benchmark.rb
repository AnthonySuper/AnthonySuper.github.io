require 'benchmark'
require 'fifthed_sim'

def divide_conquer(n, d)
  return 1.d(d) if n == 1
  return divide_conquer((n/2.0).floor, d) + divide_conquer((n/2.0).ceil, d)
end

def naive(n, d)
  1.upto(n).map{1.d(d)}.inject{|x, mem| x + mem}
end

def avg_benchmark(&block)
  1.upto(2).map do
    Benchmark.realtime(&block)
  end.inject(:+) / 2.0
end

199.upto(200).each do |n|
  d = avg_benchmark{divide_conquer(n, 10).distribution}
  puts "#{n}\t#{d}"
end

